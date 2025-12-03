'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecureVideoPlayerProps {
  lessonId: string;
  userEmail: string;
  onProgress?: (seconds: number) => void;
}

export default function SecureVideoPlayer({ 
  lessonId, 
  userEmail,
  onProgress 
}: SecureVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 20, y: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackData, setPlaybackData] = useState<{
    playbackUrl: string;
    token: string;
  } | null>(null);
  const [videoBlurred, setVideoBlurred] = useState(false);
  
  useEffect(() => {
    initializePlayer();
    
    // Setup all security measures
    const cleanupFunctions = [
      preventScreenshot(),
      preventScreenRecording(),
      preventRightClick(),
      preventDevTools(),
      setupWatermark(),
      monitorWindowFocus(),
    ];
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup?.());
    };
  }, [lessonId]);
  
  const initializePlayer = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get playback token from API
      const response = await fetch('/api/videos/playback-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get playback token');
      }
      
      const data = await response.json();
      setPlaybackData({
        playbackUrl: data.playbackUrl,
        token: data.token,
      });
      
      setIsLoading(false);
      
    } catch (err) {
      console.error('Player initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load video');
      setIsLoading(false);
    }
  };
  
  // Track video progress
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleTimeUpdate = () => {
      if (onProgress) {
        onProgress(Math.floor(videoElement.currentTime));
      }
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [onProgress]);
  
  const preventScreenshot = () => {
    const handler = (e: KeyboardEvent) => {
      // Detect PrintScreen, Cmd+Shift+3/4 (Mac), Win+Shift+S (Windows)
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) ||
        (e.key === 's' && e.shiftKey && (e.metaKey || e.ctrlKey))
      ) {
        e.preventDefault();
        
        if (videoRef.current) {
          videoRef.current.pause();
        }
        
        alert('⚠️ Screenshots are not allowed. Video paused.');
        logSuspiciousActivity('screenshot_attempt');
      }
    };
    
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  };
  
  const preventScreenRecording = () => {
    // Check for screen recording APIs
    const checkInterval = setInterval(() => {
      if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        
        // Overriding native method for security purposes
        navigator.mediaDevices.getDisplayMedia = async function(...args) {
          if (videoRef.current) {
            videoRef.current.pause();
          }
          
          alert('⚠️ Screen recording detected. Video paused.');
          logSuspiciousActivity('screen_recording_detected');
          
          throw new Error('Screen recording is not allowed');
        };
      }
    }, 5000);
    
    return () => clearInterval(checkInterval);
  };
  
  const preventRightClick = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const contextMenuHandler = (e: Event) => {
      e.preventDefault();
      return false;
    };
    
    const dragHandler = (e: Event) => {
      e.preventDefault();
      return false;
    };
    
    videoElement.addEventListener('contextmenu', contextMenuHandler);
    videoElement.addEventListener('dragstart', dragHandler);
    
    return () => {
      videoElement.removeEventListener('contextmenu', contextMenuHandler);
      videoElement.removeEventListener('dragstart', dragHandler);
    };
  };
  
  const preventDevTools = () => {
    // Detect DevTools by checking viewport size difference
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > threshold || heightDiff > threshold) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          alert('⚠️ Developer tools detected. Video paused.');
          logSuspiciousActivity('devtools_detected');
        }
      }
    };
    
    const interval = setInterval(detectDevTools, 1000);
    return () => clearInterval(interval);
  };
  
  const setupWatermark = () => {
    // Rotate watermark position every 30 seconds
    const interval = setInterval(() => {
      const positions = [
        { x: 20, y: 20 },
        { x: window.innerWidth - 320, y: 20 },
        { x: 20, y: window.innerHeight - 80 },
        { x: window.innerWidth - 320, y: window.innerHeight - 80 },
        { x: window.innerWidth / 2 - 150, y: 50 },
      ];
      
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setWatermarkPosition(randomPos);
    }, 30000);
    
    return () => clearInterval(interval);
  };
  
  const monitorWindowFocus = () => {
    const visibilityHandler = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
      }
    };
    
    const blurHandler = () => {
      setVideoBlurred(true);
    };
    
    const focusHandler = () => {
      setVideoBlurred(false);
    };
    
    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('blur', blurHandler);
    window.addEventListener('focus', focusHandler);
    
    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler);
      window.removeEventListener('blur', blurHandler);
      window.removeEventListener('focus', focusHandler);
    };
  };
  
  const logSuspiciousActivity = async (activityType: string) => {
    try {
      await fetch('/api/security/log-suspicious', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          activityType,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to log suspicious activity:', error);
    }
  };
  
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Video Error</p>
            <p className="text-sm">{error}</p>
            {error.includes('Device limit') && (
              <p className="text-sm mt-2">
                Please logout from another device to watch videos on this device.
              </p>
            )}
            {error.includes('subscription') && (
              <p className="text-sm mt-2">
                Please upgrade your subscription to access this content.
              </p>
            )}
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="mt-2 w-fit"
            >
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading secure video...</p>
      </div>
    );
  }
  
  if (!playbackData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">No video available</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full select-none">
      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-auto"
          controls
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          playsInline
          src={playbackData.playbackUrl}
          style={{
            filter: videoBlurred ? 'blur(20px)' : 'none',
            transition: 'filter 0.3s ease',
          }}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        >
          <source src={playbackData.playbackUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dynamic Watermark */}
        <div
          className="absolute pointer-events-none select-none z-10"
          style={{
            left: `${watermarkPosition.x}px`,
            top: `${watermarkPosition.y}px`,
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            transition: 'all 2s ease-out',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          {userEmail} • {new Date().toLocaleDateString()}
        </div>
        
        {/* Invisible overlay to track interactions */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />
      </div>
      
      {/* Security Warning */}
      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        <span>Protected content - Screen recording and screenshots are disabled</span>
      </div>
    </div>
  );
}
