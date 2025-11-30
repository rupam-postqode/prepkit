import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { requireSubscription, getUserAccessLevel } from "@/lib/subscription-check";
import { ContentProtectionService } from "@/lib/content-protection";
import { LessonViewer } from "@/components/lesson/LessonViewer";

interface LessonPageProps {
  params: {
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Await params in Next.js 16
  const { lessonId } = await params;

  // Fetch lesson with related data
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      chapter: {
        include: {
          module: true,
        },
      },
      practiceLinks: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
          <p className="text-gray-600">The lesson you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Check if lesson is published or user is admin
  if (!lesson.publishedAt && session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Available</h1>
          <p className="text-gray-600">This lesson is not yet published.</p>
        </div>
      </div>
    );
  }

  // Check premium content access
  const userAccessLevel = await getUserAccessLevel();
  const isAdmin = userAccessLevel === "admin";
  const hasSubscription = userAccessLevel === "premium";

  const getDifficultyClasses = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  // If lesson is premium and user doesn't have access, redirect to pricing
  if (lesson.premium && !isAdmin && !hasSubscription) {
    redirect("/pricing?message=This premium lesson requires a subscription");
  }

  // Get or create lesson progress
  let progress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user?.id || "",
        lessonId: lessonId,
      },
    },
  });

  if (!progress) {
    progress = await prisma.lessonProgress.create({
      data: {
        userId: session.user?.id || "",
        lessonId: lessonId,
      },
    });
  }



  return (
    <div className="min-h-screen bg-white">
      <div className={`flex-1 flex flex-col ${isAdmin ? 'max-w-7xl mx-auto' : 'max-w-4xl mx-auto'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <p className="text-gray-600 mt-1">{lesson.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Difficulty</div>
                <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full " + getDifficultyClasses(lesson.difficulty)}>
                {lesson.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <LessonViewer
          lesson={lesson}
          progress={progress}
          userId={session.user?.id || ""}
        />
      </div>
    </div>
  );
}
