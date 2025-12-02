import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ContentProtectionService } from "@/lib/content-protection";
import { handleApiError } from "@/lib/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      const { lessonId } = await params;
      const errorResponse = handleApiError(
        new Error('Unauthorized'),
        { method: 'GET', url: `/api/lessons/${lessonId}/content` }
      );
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const { lessonId } = await params;

    // Get protected content using the service
    const result = await ContentProtectionService.getLessonContentForUser(lessonId, session.user.id);

    if (!result.accessGranted) {
      return NextResponse.json({
        accessGranted: false,
        accessReason: result.accessReason
      }, { status: 403 });
    }

    return NextResponse.json({
      accessGranted: true,
      content: result.content,
      accessToken: result.accessToken,
    });

  } catch (error) {
    const errorResponse = handleApiError(
      error,
      { method: 'GET', url: `/api/lessons/[lessonId]/content` }
    );
    return NextResponse.json({
      accessGranted: false,
      accessReason: (errorResponse.error as { message: string }).message
    }, { status: 500 });
  }
}
