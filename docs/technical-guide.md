# PrepKit - Technical Implementation Guide
## Detailed Architecture & API Design

---

## 1. Project Structure (Next.js App Router)

```
prepkit/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (protected)/
│   │   ├── dashboard/page.tsx
│   │   ├── lessons/
│   │   │   ├── [lessonId]/page.tsx    # Main lesson viewer
│   │   │   └── [lessonId]/layout.tsx
│   │   ├── progress/page.tsx
│   │   ├── settings/page.tsx
│   │   └── account/page.tsx
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── content/
│   │   │   │   ├── chapters/page.tsx
│   │   │   │   ├── [chapterId]/lessons/page.tsx
│   │   │   │   ├── create-lesson/page.tsx
│   │   │   │   └── [lessonId]/edit/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   └── analytics/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   ├── signup/route.ts
│   │   │   └── logout/route.ts
│   │   ├── lessons/
│   │   │   ├── route.ts                # GET all lessons (paginated)
│   │   │   ├── [id]/route.ts           # GET single lesson
│   │   │   ├── [id]/progress/route.ts  # POST lesson completion
│   │   │   └── [id]/feedback/route.ts  # POST feedback
│   │   ├── videos/
│   │   │   ├── upload/route.ts         # POST video upload
│   │   │   ├── [videoId]/stream/route.ts  # GET HLS stream
│   │   │   └── [videoId]/access-token/route.ts
│   │   ├── chapters/route.ts
│   │   ├── subscriptions/
│   │   │   ├── create/route.ts         # Razorpay create order
│   │   │   ├── verify/route.ts         # Verify payment signature
│   │   │   └── webhook/route.ts        # Razorpay webhook
│   │   ├── user/
│   │   │   ├── profile/route.ts
│   │   │   └── progress/route.ts
│   │   └── admin/
│   │       ├── users/route.ts
│   │       ├── content/route.ts
│   │       └── metrics/route.ts
│   └── (public)/
│       ├── pricing/page.tsx
│       ├── about/page.tsx
│       ├── blog/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       └── faq/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── Footer.tsx
│   ├── lesson/
│   │   ├── LessonViewer.tsx
│   │   ├── Tabs.tsx
│   │   ├── MarkdownTab.tsx
│   │   ├── VideoTab.tsx
│   │   ├── NotesTab.tsx
│   │   ├── PracticeTab.tsx
│   │   └── ProgressBar.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── payment/
│   │   ├── PricingCard.tsx
│   │   ├── PaymentModal.tsx
│   │   └── SuccessModal.tsx
│   └── admin/
│       ├── ContentEditor.tsx
│       ├── VideoUploader.tsx
│       ├── MetricsChart.tsx
│       └── UserManagement.tsx
├── lib/
│   ├── db.ts                   # Prisma client
│   ├── auth.ts                 # Auth utilities
│   ├── video.ts                # Video processing
│   ├── watermark.ts            # Watermarking logic
│   ├── razorpay.ts             # Razorpay API wrapper
│   ├── cdn.ts                  # CloudFront URLs
│   └── crypto.ts               # Encryption utilities
├── hooks/
│   ├── useAuth.ts
│   ├── useLesson.ts
│   ├── useProgress.ts
│   ├── useSubscription.ts
│   └── useAnalytics.ts
├── types/
│   ├── index.ts                # TypeScript interfaces
│   ├── lesson.ts
│   ├── user.ts
│   ├── payment.ts
│   └── api.ts
├── styles/
│   ├── globals.css
│   ├── variables.css           # CSS design system
│   └── markdown.css            # Markdown styling
├── public/
│   ├── logo.png
│   ├── og-image.png
│   └── robots.txt
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data for local dev
├── .env.local                  # Environment variables
├── .env.example
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.ts
└── package.json
```

---

## 2. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ USERS ============
model User {
  id                    String   @id @default(cuid())
  email                 String   @unique
  passwordHash          String   // Argon2 hash
  name                  String
  role                  Role     @default(USER)
  
  // Profile
  targetCompanies       String[] // ["Google", "Amazon", "Flipkart"]
  experienceLevel       Experience @default(FRESHER)
  preferredLanguage     String   @default("javascript")
  
  // Subscription
  subscriptionStatus    SubscriptionStatus @default(FREE
  subscriptionPlan      String?  // "monthly", "yearly", "lifetime"
  subscriptionEndDate   DateTime?
  
  // Relations
  lessonProgress        LessonProgress[]
  subscriptions         Subscription[]
  feedback              Feedback[]
  
  // Metadata
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  lastLoginAt           DateTime?
  
  @@index([email])
  @@index([subscriptionStatus])
}

// ============ CONTENT ============
model Module {
  id          String  @id @default(cuid())
  title       String  // "DSA", "Machine Coding", etc.
  slug        String  @unique
  description String
  emoji       String  // 📚, 🎯, 🏗️, 💬, 📋
  orderIndex  Int
  
  chapters    Chapter[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Chapter {
  id                String  @id @default(cuid())
  moduleId          String
  module            Module  @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  
  title             String
  slug              String
  description       String
  orderIndex        Int
  difficultyLevel   Difficulty @default(BEGINNER)
  estimatedHours    Int
  
  lessons           Lesson[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([moduleId, slug])
  @@index([moduleId])
}

model Lesson {
  id                String  @id @default(cuid())
  chapterId         String
  chapter           Chapter @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  
  title             String
  slug              String
  description       String
  orderIndex        Int
  
  // Content
  videoUrl          String?  // S3/CloudFront URL
  videoDurationSec  Int?
  markdownContent   String  // Stored in DB or reference S3
  
  difficulty        Difficulty
  
  // Metadata
  publishedAt       DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  progress          LessonProgress[]
  practiceLinks     PracticeLink[]
  feedback          Feedback[]
  
  @@unique([chapterId, slug])
  @@index([chapterId])
  @@index([publishedAt])
}

model LessonProgress {
  id                    String  @id @default(cuid())
  userId                String
  user                  User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  lessonId              String
  lesson                Lesson  @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  startedAt             DateTime @default(now())
  completedAt           DateTime?
  
  timeSpentSeconds      Int     @default(0)
  videoWatchedPercent   Int     @default(0) // 0-100
  markdownRead          Boolean @default(false)
  
  rating                Int?    // 1-5
  notes                 String? // User's personal notes
  
  updatedAt             DateTime @updatedAt
  
  @@unique([userId, lessonId])
  @@index([userId])
  @@index([lessonId])
  @@index([completedAt])
}

model PracticeLink {
  id              String   @id @default(cuid())
  lessonId        String
  lesson          Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  platform        Platform // LEETCODE, CODESANDBOX, ALGOEXPERT, HACKERRANK
  problemTitle    String
  problemUrl      String
  difficulty      Difficulty
  orderIndex      Int
  
  createdAt       DateTime @default(now())
  
  @@index([lessonId])
}

model Feedback {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  lessonId        String?
  lesson          Lesson?  @relation(fields: [lessonId], references: [id], onDelete: SetNull)
  
  rating          Int?     // 1-5
  comment         String
  type            FeedbackType // BUG, SUGGESTION, GENERAL
  
  createdAt       DateTime @default(now())
  
  @@index([userId])
  @@index([lessonId])
  @@index([type])
}

// ============ SUBSCRIPTIONS & PAYMENTS ============
model Subscription {
  id                      String  @id @default(cuid())
  userId                  String
  user                    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  plan                    SubscriptionPlan
  status                  SubscriptionStatus
  
  razorpaySubscriptionId  String? @unique
  razorpayCustomerId      String?
  
  startDate               DateTime @default(now())
  endDate                 DateTime?
  
  amount                  Int     // in paise (₹100 = 10000 paise)
  currency                String  @default("INR")
  
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  
  payments                Payment[]
  
  @@index([userId])
  @@index([status])
  @@index([endDate])
}

model Payment {
  id                      String  @id @default(cuid())
  subscriptionId          String?
  subscription            Subscription? @relation(fields: [subscriptionId], references: [id], onDelete: SetNull)
  
  userId                  String
  
  razorpayPaymentId       String  @unique
  razorpayOrderId         String
  
  amount                  Int     // in paise
  currency                String  @default("INR")
  
  status                  PaymentStatus
  method                  String? // "card", "upi", "netbanking", etc.
  
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
}

// ============ ENUMS ============
enum Role {
  USER
  ADMIN
}

enum Experience {
  FRESHER
  JUNIOR
  MID
  SENIOR
}

enum SubscriptionStatus {
  FREE
  ACTIVE
  EXPIRED
  CANCELLED
  SUSPENDED
}

enum SubscriptionPlan {
  MONTHLY
  QUARTERLY
  YEARLY
  LIFETIME
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum Platform {
  LEETCODE
  CODESANDBOX
  ALGOEXPERT
  HACKERRANK
}

enum FeedbackType {
  BUG
  SUGGESTION
  GENERAL
}

enum PaymentStatus {
  CREATED
  AUTHORIZED
  CAPTURED
  FAILED
  REFUNDED
}
```

---

## 3. API Routes & Design

### Authentication API

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import prisma from "@/lib/db";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user) {
          throw new Error("User not found");
        }
        
        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash
        );
        
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### Lessons API

```typescript
// app/api/lessons/[id]/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        chapter: {
          include: { module: true },
        },
        practiceLinks: { orderBy: { orderIndex: "asc" } },
      },
    });
    
    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }
    
    // Check subscription (if lesson is published)
    if (lesson.publishedAt) {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email || "" },
        select: { subscriptionStatus: true },
      });
      
      if (user?.subscriptionStatus === "FREE") {
        // Only return free lesson content
        return NextResponse.json({
          ...lesson,
          markdownContent: null,
          videoUrl: null,
          practiceLinks: [],
        });
      }
    }
    
    // Track lesson view
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user?.id || "",
          lessonId: params.id,
        },
      },
      update: { startedAt: new Date() },
      create: {
        userId: session.user?.id || "",
        lessonId: params.id,
      },
    });
    
    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Payment Webhook

```typescript
// app/api/subscriptions/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";

const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(body)
      .digest("hex");
    
    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }
    
    const event = JSON.parse(body);
    
    // Handle payment success
    if (event.event === "payment.authorized") {
      const payment = event.payload.payment.entity;
      
      // Create subscription record
      await prisma.subscription.create({
        data: {
          userId: payment.notes.userId,
          plan: payment.notes.plan,
          status: "ACTIVE",
          razorpayPaymentId: payment.id,
          amount: payment.amount,
          endDate: calculateEndDate(payment.notes.plan),
        },
      });
      
      // Update user subscription status
      await prisma.user.update({
        where: { id: payment.notes.userId },
        data: {
          subscriptionStatus: "ACTIVE",
          subscriptionPlan: payment.notes.plan,
          subscriptionEndDate: calculateEndDate(payment.notes.plan),
        },
      });
      
      // TODO: Send confirmation email
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateEndDate(plan: string): Date {
  const today = new Date();
  const endDate = new Date(today);
  
  switch (plan) {
    case "MONTHLY":
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case "QUARTERLY":
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case "YEARLY":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    case "LIFETIME":
      endDate.setFullYear(endDate.getFullYear() + 100);
      break;
  }
  
  return endDate;
}
```

---

## 4. Frontend Components

### Lesson Viewer Component

```typescript
// components/lesson/LessonViewer.tsx
"use client";

import { useState } from "react";
import { Lesson } from "@/types";
import MarkdownTab from "./MarkdownTab";
import VideoTab from "./VideoTab";
import NotesTab from "./NotesTab";
import PracticeTab from "./PracticeTab";

interface LessonViewerProps {
  lesson: Lesson;
  onProgress: (progress: number) => void;
}

type TabType = "markdown" | "video" | "notes" | "practice";

export default function LessonViewer({ lesson, onProgress }: LessonViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("markdown");
  
  return (
    <div className="flex-1 flex flex-col bg-cream-50 dark:bg-charcoal-700">
      {/* Tab Navigation */}
      <div className="border-b border-color-border sticky top-0 bg-inherit z-10">
        <div className="flex px-6">
          <TabButton
            label="📄 Markdown"
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
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === "markdown" && (
          <MarkdownTab content={lesson.markdownContent} />
        )}
        {activeTab === "video" && (
          <VideoTab
            videoUrl={lesson.videoUrl}
            duration={lesson.videoDurationSec}
            onProgress={onProgress}
          />
        )}
        {activeTab === "notes" && (
          <NotesTab
            lessonId={lesson.id}
            keyTakeaways={lesson.keyTakeaways}
            commonMistakes={lesson.commonMistakes}
          />
        )}
        {activeTab === "practice" && (
          <PracticeTab
            practiceLinks={lesson.practiceLinks}
            lessonId={lesson.id}
          />
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
      className={`px-6 py-4 font-medium text-sm transition ${
        active
          ? "border-b-2 border-color-primary text-color-primary"
          : "text-color-text-secondary hover:text-color-text"
      }`}
    >
      {label}
    </button>
  );
}
```

### Video Player with DRM

```typescript
// components/lesson/VideoTab.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useProtectContent } from "@/hooks/useProtectContent";

interface VideoTabProps {
  videoUrl: string;
  duration: number;
  onProgress: (progress: number) => void;
}

export default function VideoTab({
  videoUrl,
  duration,
  onProgress,
}: VideoTabProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedPercent, setWatchedPercent] = useState(0);
  
  // Enable content protection
  useProtectContent({
    onScreenCapture: () => alert("Screen recording is not allowed"),
  });
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      const percent = (video.currentTime / video.duration) * 100;
      setWatchedPercent(percent);
      onProgress(percent);
    };
    
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [onProgress]);
  
  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center text-white text-center z-10">
          <div className="text-2xl font-bold select-none">
            PrepKit | User ID: xyz123
          </div>
        </div>
        
        {/* Video Player */}
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          controlsList="nodownload"
          className="w-full h-full"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      
      {/* Progress Bar */}
      <div className="bg-color-surface rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-color-text-secondary">
            Progress
          </span>
          <span className="text-sm font-medium text-color-primary">
            {watchedPercent.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-color-border rounded-full h-2">
          <div
            className="bg-color-primary h-2 rounded-full transition-all"
            style={{ width: `${watchedPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Content Protection (Anti-Piracy)

```typescript
// lib/protection.ts
export const CONTENT_PROTECTION = {
  // Disable text selection
  disableTextSelection: `
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  `,
  
  // Disable right-click
  disableContextMenu: (e: MouseEvent) => {
    e.preventDefault();
    return false;
  },
  
  // Detect screenshot
  detectScreenCapture: () => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "PrintScreen") {
        alert("Screenshot is disabled for protected content");
        e.preventDefault();
      }
    });
  },
  
  // Detect screen recording
  detectScreenRecording: () => {
    if (navigator.getDisplayMedia) {
      const originalGetDisplayMedia = navigator.getDisplayMedia;
      navigator.getDisplayMedia = (...args) => {
        alert("Screen recording is not allowed");
        return Promise.reject(new Error("Screen recording disabled"));
      };
    }
  },
};

// Add watermark
export function addWatermark(userId: string) {
  const watermark = document.createElement("div");
  watermark.id = "content-watermark";
  watermark.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 100px;
    color: rgba(0, 0, 0, 0.05);
    pointer-events: none;
    z-index: 1;
    text-align: center;
    width: 200%;
    height: 200%;
    white-space: nowrap;
    font-weight: bold;
  `;
  watermark.textContent = `PrepKit User: ${userId}`;
  document.body.appendChild(watermark);
}

// Device fingerprinting
export async function getDeviceFingerprint() {
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const platform = navigator.platform;
  
  const fingerprintString = `${userAgent}|${language}|${platform}`;
  
  // Simple hash (use crypto-js for production)
  const hash = await hashString(fingerprintString);
  
  return hash;
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
```

### Hook for Content Protection

```typescript
// hooks/useProtectContent.ts
import { useEffect } from "react";
import {
  CONTENT_PROTECTION,
  addWatermark,
  getDeviceFingerprint,
} from "@/lib/protection";

interface UseProtectContentOptions {
  onScreenCapture?: () => void;
  onCopyAttempt?: () => void;
}

export function useProtectContent(options: UseProtectContentOptions = {}) {
  useEffect(() => {
    // Add watermark
    const userId = localStorage.getItem("userId");
    if (userId) {
      addWatermark(userId);
    }
    
    // Detect screen capture
    CONTENT_PROTECTION.detectScreenCapture();
    CONTENT_PROTECTION.detectScreenRecording();
    
    // Disable right-click on protected content
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-protected]")) {
        e.preventDefault();
        options.onCopyAttempt?.();
      }
    };
    
    document.addEventListener("contextmenu", handleContextMenu);
    
    // Disable Ctrl+C/Cmd+C
    const handleCopy = (e: ClipboardEvent) => {
      const target = document.activeElement as HTMLElement;
      if (target?.closest("[data-protected]")) {
        e.preventDefault();
        options.onCopyAttempt?.();
      }
    };
    
    document.addEventListener("copy", handleCopy);
    
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
  }, [options]);
}
```

---

## 6. Environment Variables (.env.local)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/prepkit"

# NextAuth
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# AWS (S3 + CloudFront)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_S3_BUCKET="prepkit-videos"
AWS_REGION="ap-south-1"
AWS_CLOUDFRONT_DOMAIN="d123xyz.cloudfront.net"

# Razorpay
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Stripe (backup)
STRIPE_PUBLIC_KEY="pk_test_xxxxx"
STRIPE_SECRET_KEY="sk_test_xxxxx"

# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Posthog (Analytics)
NEXT_PUBLIC_POSTHOG_KEY="phc_xxxxx"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Email
RESEND_API_KEY="re_xxxxx"

# Optional: Sentry (Error tracking)
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/12345"
```

---

## 7. Docker Setup (Optional for Production)

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: "3.9"

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: prepkit
      POSTGRES_PASSWORD: password
      POSTGRES_DB: prepkit
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://prepkit:password@db:5432/prepkit
      NEXTAUTH_SECRET: local-secret-change-in-production
      NEXTAUTH_URL: http://localhost:3000
    depends_on:
      - db
    command: bash -c "npx prisma migrate deploy && npm start"

volumes:
  postgres_data:
```

---

## 8. Deployment (Vercel + Neon)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Create Neon database
# - Visit: https://neon.tech/
# - Create new project
# - Copy DATABASE_URL

# 4. Set environment variables
vercel env add DATABASE_URL

# 5. Deploy
vercel --prod

# 6. Run migrations on production
vercel exec "npx prisma migrate deploy"
```

---

## 9. Development Workflow

```bash
# Setup
npm install
cp .env.example .env.local
# Update .env.local with local values

# Run dev server
npm run dev
# Open http://localhost:3000

# Database setup
npx prisma generate
npx prisma migrate dev --name init

# Seed data (optional)
npx prisma db seed

# Testing
npm run test

# Build for production
npm run build
npm start
```

---

**This technical guide provides the foundation for building PrepKit. Start with the project structure, build core auth and lesson viewing, then add payment and content protection layers.**

**Key implementation priorities:**
1. ✅ Auth + User management
2. ✅ Lesson viewing + markdown rendering
3. ✅ Basic video streaming (no DRM initially)
4. ✅ Razorpay integration
5. ✅ Content protection layers
6. ✅ Admin dashboard for content management
