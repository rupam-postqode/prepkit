import { NextRequest } from "next/server";
import { realtimeSync } from "@/lib/realtime-sync";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response('User ID is required', { status: 400 });
  }

  // Create Server-Sent Events stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const connectionId = `${userId}-${Date.now()}`;
      
      // Send initial connection event
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
        type: 'CONNECTION_ESTABLISHED',
        userId,
        connectionId,
        timestamp: new Date(),
      })}\n\n`));

      // Function to send events to this connection
      const sendEvent = (event: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch (error) {
          console.error('Error sending SSE event:', error);
        }
      };

      // Store connection for sending events
      (realtimeSync as any).addConnection(connectionId, sendEvent);

      // Send any queued events for this user
      const queuedEvents = (realtimeSync as any).getQueuedEvents(userId) || [];
      for (const event of queuedEvents) {
        sendEvent(event);
      }
      (realtimeSync as any).clearQueuedEvents(userId);

      // Keep connection alive with periodic pings
      const pingInterval = setInterval(() => {
        try {
          sendEvent({
            type: 'PING',
            timestamp: new Date(),
          });
        } catch (error) {
          clearInterval(pingInterval);
        }
      }, 30000); // Ping every 30 seconds

      // Cleanup on disconnect
      req.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        (realtimeSync as any).removeConnection(connectionId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}