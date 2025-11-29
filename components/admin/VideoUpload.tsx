"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VideoUploadProps {
  onVideoUploaded: (videoData: {
    id: string;
    fileName: string;
    originalName: string;
    url: string;
  }) => void;
  currentVideoId?: string;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export function VideoUpload({ onVideoUploaded, currentVideoId }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<{
    id: string;
    fileName: string;
    originalName: string;
    url: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB
      setError("File size must be less than 500MB");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const formData = new FormData();
      formData.append("video", file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadProgress({
            loaded: event.loaded,
            total: event.total,
            percentage,
          });
        }
      });

      // Handle completion
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setUploadedVideo(response.video);
            onVideoUploaded(response.video);
            setUploadProgress(null);
          } else {
            setError(response.error || "Upload failed");
          }
        } else {
          setError("Upload failed");
        }
        setIsUploading(false);
      });

      // Handle errors
      xhr.addEventListener("error", () => {
        setError("Network error occurred");
        setIsUploading(false);
        setUploadProgress(null);
      });

      xhr.open("POST", "/api/videos/upload");
      xhr.send(formData);

    } catch (error) {
      setError("Upload failed");
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, [onVideoUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Lesson Video (Optional)
        </label>
        {uploadedVideo && (
          <span className="text-sm text-green-600">✓ Video uploaded</span>
        )}
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isUploading
            ? "border-blue-300 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="p-6 text-center">
          {isUploading ? (
            <div className="space-y-4">
              <div className="text-lg">📤 Uploading video...</div>
              {uploadProgress && (
                <div className="space-y-2">
                  <Progress value={uploadProgress.percentage} className="w-full" />
                  <div className="text-sm text-gray-600">
                    {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
                    ({uploadProgress.percentage}%)
                  </div>
                </div>
              )}
            </div>
          ) : uploadedVideo ? (
            <div className="space-y-4">
              <div className="text-green-600 text-lg">✅ Video uploaded successfully</div>
              <div className="text-sm text-gray-600">
                <div className="font-medium">{uploadedVideo.originalName}</div>
                <div className="mt-2">
                  <video
                    src={uploadedVideo.url}
                    controls
                    className="max-w-full h-auto max-h-48 mx-auto rounded"
                    preload="metadata"
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUploadedVideo(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                Replace Video
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-4xl">🎥</div>
              <div>
                <div className="text-lg font-medium text-gray-900">
                  Upload a video for this lesson
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Drag and drop a video file here, or click to browse
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Supports MP4, WebM, AVI, MOV • Max 500MB
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Choose Video
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Help text */}
      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Video Upload Tips:</h4>
        <ul className="text-xs space-y-1">
          <li>• Videos should be high quality but under 500MB</li>
          <li>• Recommended formats: MP4 (H.264) for best compatibility</li>
          <li>• Videos will be processed for optimal streaming</li>
          <li>• You can replace the video anytime before publishing</li>
        </ul>
      </div>
    </div>
  );
}

// Progress component (if not available in ui components)
function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
