import { NextRequest } from 'next/server';
import { prisma } from './db';

interface SyncEvent {
  type: 'PATH_SWITCH' | 'PROGRESS_UPDATE' | 'MILESTONE_COMPLETE' | 'ALERT_CREATED';
  userId: string;
  pathId?: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

class RealtimeSyncManager {
  private static instance: RealtimeSyncManager;
  private eventQueues: Map<string, SyncEvent[]> = new Map();
  private connections: Map<string, (event: SyncEvent) => void> = new Map();

  private constructor() {}

  static getInstance(): RealtimeSyncManager {
    if (!RealtimeSyncManager.instance) {
      RealtimeSyncManager.instance = new RealtimeSyncManager();
    }
    return RealtimeSyncManager.instance;
  }

  // Add connection for SSE
  addConnection(connectionId: string, sendCallback: (event: SyncEvent) => void) {
    this.connections.set(connectionId, sendCallback);
  }

  // Remove connection
  removeConnection(connectionId: string) {
    this.connections.delete(connectionId);
  }

  // Get queued events for user
  getQueuedEvents(userId: string): SyncEvent[] {
    return this.eventQueues.get(userId) || [];
  }

  // Clear queued events for user
  clearQueuedEvents(userId: string) {
    this.eventQueues.delete(userId);
  }

  // Send event to specific user
  async sendToUser(userId: string, event: Omit<SyncEvent, 'timestamp'>) {
    const fullEvent: SyncEvent = {
      ...event,
      timestamp: new Date(),
    };

    // Check if user has active connections
    const userConnections = Array.from(this.connections.entries())
      .filter(([connectionId]) => connectionId.startsWith(userId));

    if (userConnections.length > 0) {
      // Send to active connections
      for (const [, sendCallback] of userConnections) {
        try {
          sendCallback(fullEvent);
        } catch (error) {
          console.error('Error sending event:', error);
        }
      }
    } else {
      // Queue for when user reconnects
      const existingQueue = this.eventQueues.get(userId) || [];
      existingQueue.push(fullEvent);
      
      // Keep only last 10 events per user
      if (existingQueue.length > 10) {
        existingQueue.splice(0, existingQueue.length - 10);
      }
      
      this.eventQueues.set(userId, existingQueue);

      // Store as timeline alert for offline notification
      await this.storeOfflineEvent(fullEvent);
    }
  }

  // Send event to all users in a path
  async sendToPath(pathId: string, event: Omit<SyncEvent, 'timestamp' | 'userId'>) {
    // Get all users enrolled in this path
    const pathUsers = await prisma.userPathProgress.findMany({
      where: {
        learningPathId: pathId,
        isActive: true,
      },
      select: {
        userId: true,
      },
    });

    // Send to each user
    for (const { userId } of pathUsers) {
      await this.sendToUser(userId, {
        ...event,
        userId,
        pathId,
      });
    }
  }

  private async storeOfflineEvent(event: SyncEvent) {
    try {
      // Create a timeline alert for offline notification
      if (event.type === 'PATH_SWITCH' || event.type === 'MILESTONE_COMPLETE') {
        await prisma.timelineAlert.create({
          data: {
            userPathProgressId: event.pathId || '',
            alertType: event.type,
            severity: 'INFO',
            message: this.getEventMessage(event),
            actionRequired: false,
            scheduledFor: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Error storing offline event:', error);
    }
  }

  private getEventMessage(event: SyncEvent): string {
    switch (event.type) {
      case 'PATH_SWITCH':
        return `Learning path updated: ${event.data.newPathTitle || 'New path selected'}`;
      case 'PROGRESS_UPDATE':
        return `Progress updated: ${event.data.progressPercentage || 0}% complete`;
      case 'MILESTONE_COMPLETE':
        return `Milestone achieved: ${event.data.milestoneTitle || 'Milestone completed'}`;
      case 'ALERT_CREATED':
        return `New alert: ${event.data.message || 'System notification'}`;
      default:
        return 'Learning path update';
    }
  }

  // Public methods for triggering updates from server-side
  async notifyPathSwitch(userId: string, fromPathId: string, toPathId: string, newPathTitle: string) {
    await this.sendToUser(userId, {
      type: 'PATH_SWITCH',
      userId,
      data: {
        fromPathId,
        toPathId,
        newPathTitle,
      },
    });
  }

  async notifyProgressUpdate(userId: string, pathId: string, progressData: Record<string, unknown>) {
    await this.sendToUser(userId, {
      type: 'PROGRESS_UPDATE',
      userId,
      pathId,
      data: progressData,
    });
  }

  async notifyMilestoneComplete(userId: string, pathId: string, milestoneData: Record<string, unknown>) {
    await this.sendToUser(userId, {
      type: 'MILESTONE_COMPLETE',
      userId,
      pathId,
      data: milestoneData,
    });
  }

  async notifyAlert(userId: string, alertData: Record<string, unknown>) {
    await this.sendToUser(userId, {
      type: 'ALERT_CREATED',
      userId,
      data: alertData,
    });
  }

  // Get connection stats
  getConnectionStats() {
    return {
      totalConnections: this.connections.size,
      queuedEvents: Array.from(this.eventQueues.entries()).map(([userId, events]) => ({
        userId,
        eventCount: events.length,
      })),
    };
  }
}

// Export singleton instance
export const realtimeSync = RealtimeSyncManager.getInstance();

// Client-side hook for using SSE
export function useRealtimeSync(userId: string) {
  if (typeof window === 'undefined') {
    return {
      connect: () => {},
      disconnect: () => {},
      isConnected: false,
      lastEvent: null,
    };
  }

  let eventSource: EventSource | null = null;
  let isConnected = false;
  let lastEvent: SyncEvent | null = null;

  const connect = () => {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(`/api/realtime-sync?userId=${userId}`);

    eventSource.onopen = () => {
      isConnected = true;
      console.log('Connected to realtime sync');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        lastEvent = data;
        
        // Trigger custom event for components to listen to
        window.dispatchEvent(new CustomEvent('realtime-update', { detail: data }));
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      isConnected = false;
      console.error('SSE connection error:', error);
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (!isConnected) {
          connect();
        }
      }, 5000);
    };
  };

  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      isConnected = false;
    }
  };

  return {
    connect,
    disconnect,
    isConnected,
    lastEvent,
  };
}