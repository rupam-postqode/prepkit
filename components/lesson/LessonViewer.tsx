"use client";

import { useState, useEffect } from "react";
import { Lesson, LessonProgress, PracticeLink } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";

interface LessonViewerProps {
  lesson: Lesson & {
    chapter: {
      module: {
        title: string;
      };
      title: string;
    };
    practiceLinks: PracticeLink[];
    importantPoints: string | null;
    commonMistakes: string | null;
    quickReference: string | null;
  };
  progress: LessonProgress;
  userId: string;
}

type TabType = "markdown" | "video" | "notes" | "practice";

function ContentWatermark({ userId }: { userId: string }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='rgba(0,0,0,0.03)' text-anchor='middle' dominant-baseline='middle' transform='rotate(-45 150 150)'%3EPrepKit User: ${userId.slice(-6)}%3C/text%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
      }}
    />
  );
}

export function LessonViewer({ lesson, progress, userId }: LessonViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("markdown");
  const [isCompleted, setIsCompleted] = useState(!!progress.completedAt);
  const { data: session } = useSession();

  // Content protection effects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshots are disabled for protected content');
        return false;
      }

      // Prevent Ctrl+C, Ctrl+X, Ctrl+V on protected content
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'v')) {
        const target = e.target as HTMLElement;
        if (target.closest('.content-protected')) {
          e.preventDefault();
          alert('Copy/paste is disabled for protected content');
          return false;
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.content-protected')) {
        e.preventDefault();
        alert('Right-click is disabled for protected content');
        return false;
      }
    };

    // Detect screen capture attempts (basic detection)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page became hidden - could be screenshot or tab switch
        console.log('Content protection: Page hidden - potential screenshot attempt');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleMarkComplete = async () => {
    try {
      const response = await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: true,
          timeSpentSeconds: progress.timeSpentSeconds || 0,
        }),
      });

      if (response.ok) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Content Watermark */}
      <ContentWatermark userId={session?.user?.id || userId} />

      {/* Tab Navigation - Horizontal scroll on mobile */}
      <div className="border-b border-gray-200 bg-white overflow-x-auto">
        <div className="px-4 lg:px-6">
          <nav className="flex space-x-4 lg:space-x-8 min-w-max">
            <TabButton
              label="📄 Content"
              active={activeTab === "markdown"}
              onClick={() => setActiveTab("markdown")}
            />
            <TabButton
              label="🎥 Video"
              active={activeTab === "video"}
              onClick={() => setActiveTab("video")}
            />
            <TabButton
              label="📝 Notes"
              active={activeTab === "notes"}
              onClick={() => setActiveTab("notes")}
            />
            <TabButton
              label="💻 Practice"
              active={activeTab === "practice"}
              onClick={() => setActiveTab("practice")}
            />
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto ios-scroll">
        {activeTab === "markdown" && (
          <MarkdownTab content={lesson.markdownContent || "No content available."} />
        )}
        {activeTab === "video" && (
          <VideoTab videoUrl={lesson.videoUrl} />
        )}
        {activeTab === "notes" && (
          <NotesTab
            importantPoints={lesson.importantPoints}
            commonMistakes={lesson.commonMistakes}
            quickReference={lesson.quickReference}
          />
        )}
        {activeTab === "practice" && (
          <PracticeTab practiceLinks={lesson.practiceLinks} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
        active
          ? "border-indigo-500 text-indigo-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

function MarkdownTab({ content }: { content: string }) {
  return (
    <div className="p-8">
      <div
        className="prose prose-gray max-w-none content-protected"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        dangerouslySetInnerHTML={{
          __html: content.replace(/\n/g, '<br>'),
        }}
      />
    </div>
  );
}

function VideoTab({ videoUrl }: { videoUrl: string | null }) {
  if (!videoUrl) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-4">🎥</div>
        <p>No video available for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
        {/* Video Protection Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            PrepKit Protected Content
          </div>
        </div>

        <video
          src={videoUrl}
          controls
          controlsList="nodownload"
          className="w-full h-full"
          poster="/video-placeholder.jpg"
          onContextMenu={(e) => {
            e.preventDefault();
            alert('Right-click is disabled for protected content');
          }}
          onLoadedData={(e) => {
            // Disable picture-in-picture
            const video = e.target as HTMLVideoElement;
            if (video.disablePictureInPicture) {
              video.disablePictureInPicture = true;
            }
          }}
        >
          {"Your browser does not support the video tag."}
        </video>
      </div>

      {/* Video Protection Notice */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-lg">🔒</div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Protected Video Content
            </h4>
            <p className="text-xs text-blue-700">
              This video is protected content. Downloads, screenshots, and sharing are disabled.
              Right-click functionality is restricted for content security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesTab({
  importantPoints,
  commonMistakes,
  quickReference
}: {
  importantPoints: string | null;
  commonMistakes: string | null;
  quickReference: string | null;
}) {
  const parsedImportantPoints = importantPoints ? JSON.parse(importantPoints) : [];
  const parsedCommonMistakes = commonMistakes ? JSON.parse(commonMistakes) : [];

  return (
    <div className="p-8">
      <div className="space-y-6">
        {parsedImportantPoints.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Points</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {parsedImportantPoints.map((point: string, index: number) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {parsedCommonMistakes.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Mistakes</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {parsedCommonMistakes.map((mistake: string, index: number) => (
                <li key={index}>{mistake}</li>
              ))}
            </ul>
          </div>
        )}

        {quickReference && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Reference</h3>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
              {quickReference}
            </div>
          </div>
        )}

        {parsedImportantPoints.length === 0 && parsedCommonMistakes.length === 0 && !quickReference && (
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p>No notes available for this lesson.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeTab({ practiceLinks }: { practiceLinks: PracticeLink[] }) {
  if (practiceLinks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-4">💻</div>
        <p>No practice problems available for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Practice Problems</h3>
        <div className="grid gap-4">
          {practiceLinks.map((link) => (
            <Card key={link.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{link.problemTitle}</h4>
                  <p className="text-sm text-gray-600 capitalize">{link.platform.toLowerCase()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    link.difficulty === 'EASY'
                      ? 'bg-green-100 text-green-800'
                      : link.difficulty === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {link.difficulty}
                  </span>
                  <a
                    href={link.problemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Solve →
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
