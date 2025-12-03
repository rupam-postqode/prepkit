"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Lesson, LessonProgress, PracticeLink } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Play,
  BookOpen,
  Code,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  ExternalLink,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { useSession } from "next-auth/react";
import rehypeHighlight from "rehype-highlight";
import SecureVideoPlayer from "@/components/SecureVideoPlayer";

// Dynamically import the markdown preview to avoid SSR issues
const MDEditorPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
});

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
      className="absolute inset-0 pointer-events-none z-0 select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='rgba(0,0,0,0.03)' text-anchor='middle' dominant-baseline='middle' transform='rotate(-45 150 150)'%3EPrepKit User: ${userId.slice(-6)}%3C/text%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
        // Restrict watermark to content area only, not entire viewport
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    />
  );
}

export function LessonViewer({ lesson, progress, userId }: LessonViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("markdown");
  const [isCompleted, setIsCompleted] = useState(!!progress.completedAt);
  const [lessonContent, setLessonContent] = useState<string>("");
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Fetch protected content on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setContentLoading(true);
        setContentError(null);

        const response = await fetch(`/api/lessons/${lesson.id}/content`);

        if (!response.ok) {
          const errorData = await response.json();
          setContentError(errorData.accessReason || 'Access denied');
          return;
        }

        const data = await response.json();

        if (data.accessGranted) {
          setLessonContent(data.content || '');
        } else {
          setContentError(data.accessReason || 'Access denied');
        }
      } catch (error) {
        console.error('Failed to fetch lesson content:', error);
        setContentError('Failed to load content');
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, [lesson.id]);

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
    <div className="flex flex-col h-[calc(100vh-8rem)] relative bg-background">
      {/* Progress Bar */}
      <div className="bg-card border-b border-border px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {Math.floor((progress.timeSpentSeconds || 0) / 60)}m spent
              </span>
            </div>
            {lesson.premium && (
              <Badge variant="secondary" className="text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {!isCompleted && (
            <Button onClick={handleMarkComplete} size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          )}

          {isCompleted && (
            <Badge variant="default" className="bg-success text-success-foreground">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="h-full flex flex-col">
          <div className="border-b border-border bg-card px-6 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
              <TabsTrigger value="markdown" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Video</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
              <TabsTrigger value="practice" className="flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">Practice</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="markdown" className="m-0 h-full">
              <MarkdownTab
                content={lessonContent}
                loading={contentLoading}
                error={contentError}
              />
            </TabsContent>

            <TabsContent value="video" className="m-0 h-full">
              <VideoTab 
                lessonId={lesson.id}
                videoUrl={lesson.videoUrl} 
                userEmail={session?.user?.email || 'user'}
                onProgress={(seconds) => {
                  // Update progress in real-time
                  console.log(`Video progress: ${seconds}s`);
                }}
              />
            </TabsContent>

            <TabsContent value="notes" className="m-0 h-full">
              <NotesTab
                importantPoints={lesson.importantPoints}
                commonMistakes={lesson.commonMistakes}
                quickReference={lesson.quickReference}
              />
            </TabsContent>

            <TabsContent value="practice" className="m-0 h-full">
              <PracticeTab practiceLinks={lesson.practiceLinks} />
            </TabsContent>
          </div>
        </Tabs>
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

function MarkdownTab({ content, loading, error }: { content: string; loading: boolean; error: string | null }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Error:</strong> {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Content Available</h3>
            <p className="text-sm text-muted-foreground">
              This lesson doesn't have content yet. Check back later or contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      <div
        className="content-protected wmde-markdown-color"
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
      >
        <MDEditorPreview
          source={content}
          rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
          style={{
            backgroundColor: 'transparent',
            color: 'inherit',
          }}
        />
      </div>

      {/* Content Protection Notice */}
      <Alert className="mt-8">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          This content is protected. Copying, screenshots, and sharing are disabled for educational integrity.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function VideoTab({ 
  lessonId,
  videoUrl, 
  userEmail,
  onProgress 
}: { 
  lessonId: string;
  videoUrl: string | null;
  userEmail: string;
  onProgress?: (seconds: number) => void;
}) {
  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Video Available</h3>
            <p className="text-sm text-muted-foreground">
              This lesson doesn't have a video yet. The content is available in text format.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      <SecureVideoPlayer 
        lessonId={lessonId}
        userEmail={userEmail}
        onProgress={onProgress}
      />
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

  if (parsedImportantPoints.length === 0 && parsedCommonMistakes.length === 0 && !quickReference) {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Notes Available</h3>
            <p className="text-sm text-muted-foreground">
              This lesson doesn't have additional notes or study materials yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8">
      {parsedImportantPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Important Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {parsedImportantPoints.map((point: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {parsedCommonMistakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              <span>Common Mistakes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {parsedCommonMistakes.map((mistake: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{mistake}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {quickReference && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-primary" />
              <span>Quick Reference</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap border">
              {quickReference}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PracticeTab({ practiceLinks }: { practiceLinks: PracticeLink[] }) {
  if (practiceLinks.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Practice Problems</h3>
          <p className="text-sm text-muted-foreground">
            This lesson doesn't have practice problems yet. Check back later.
          </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Practice Problems</h2>
        <p className="text-muted-foreground">
          Apply what you've learned with these coding challenges
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {practiceLinks.map((link) => (
          <Card key={link.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 truncate">
                    {link.problemTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {link.platform.toLowerCase()}
                  </p>
                </div>
                <Badge
                  variant={
                    link.difficulty === 'EASY' ? 'default' :
                    link.difficulty === 'MEDIUM' ? 'secondary' : 'destructive'
                  }
                  className={
                    link.difficulty === 'EASY' ? 'bg-success text-success-foreground' :
                    link.difficulty === 'MEDIUM' ? 'bg-warning text-warning-foreground' :
                    'bg-destructive text-destructive-foreground'
                  }
                >
                  {link.difficulty}
                </Badge>
              </div>

              <Button asChild className="w-full">
                <a
                  href={link.problemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Solve Problem</span>
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert className="mt-6">
        <Target className="h-4 w-4" />
        <AlertDescription>
          These practice problems will help reinforce your understanding. Try to solve them on your own first before checking solutions.
        </AlertDescription>
      </Alert>
    </div>
  );
}
