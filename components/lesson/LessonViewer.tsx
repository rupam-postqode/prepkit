"use client";

import { useState } from "react";
import { Lesson, LessonProgress, PracticeLink } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LessonViewerProps {
  lesson: Lesson & {
    chapter: {
      module: {
        title: string;
      };
      title: string;
    };
    practiceLinks: PracticeLink[];
  };
  progress: LessonProgress;
  userId: string;
}

type TabType = "markdown" | "video" | "notes" | "practice";

export function LessonViewer({ lesson, progress, userId }: LessonViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("markdown");
  const [isCompleted, setIsCompleted] = useState(!!progress.completedAt);

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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar - Collapsible on mobile */}
      <div className="lg:w-80 lg:bg-gray-50 lg:border-r lg:border-gray-200 p-4 lg:p-6 order-2 lg:order-1">
        <div className="space-y-4 lg:space-y-6">
          {/* Progress */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress.videoWatchedPercent || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {progress.videoWatchedPercent || 0}% watched
            </p>
          </div>

          {/* Actions */}
          <div>
            <Button
              onClick={handleMarkComplete}
              disabled={isCompleted}
              className="w-full mobile-btn touch-target"
              variant={isCompleted ? "secondary" : "default"}
            >
              {isCompleted ? "✓ Completed" : "Mark as Complete"}
            </Button>
          </div>

          {/* Practice Links */}
          {lesson.practiceLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Practice Problems</h3>
              <div className="space-y-2">
                {lesson.practiceLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.problemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-white rounded border border-gray-200 hover:border-indigo-300 transition-colors touch-target"
                  >
                    <div className="text-sm font-medium text-gray-900">{link.problemTitle}</div>
                    <div className="text-xs text-gray-500 capitalize">{link.platform.toLowerCase()}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col order-1 lg:order-2">
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
            <NotesTab lessonId={lesson.id} />
          )}
          {activeTab === "practice" && (
            <PracticeTab practiceLinks={lesson.practiceLinks} />
          )}
        </div>
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
        className="prose prose-gray max-w-none"
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
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          src={videoUrl}
          controls
          className="w-full h-full"
          poster="/video-placeholder.jpg"
        >
          {"Your browser does not support the video tag."}
        </video>
      </div>
    </div>
  );
}

function NotesTab({ lessonId }: { lessonId: string }) {
  return (
    <div className="p-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Points</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Key concept 1</li>
            <li>Key concept 2</li>
            <li>Key concept 3</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Mistakes</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Mistake to avoid 1</li>
            <li>Mistake to avoid 2</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Reference</h3>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <p>// Code example</p>
            <p>const example = "reference";</p>
          </div>
        </div>
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
