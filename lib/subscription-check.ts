import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import { prisma } from "./db";

export interface UserWithSubscription {
  id: string;
  subscriptionStatus: string;
  role: string;
  subscriptionEndDate?: Date | null;
}

/**
 * Get user with subscription status
 */
export async function getUserWithSubscription(): Promise<UserWithSubscription | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      subscriptionStatus: true,
      role: true,
      subscriptionEndDate: true,
    },
  });

  return user;
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const user = await getUserWithSubscription();
  
  // Admin always has access
  if (user?.role === "ADMIN") {
    return true;
  }
  
  // Check if subscription is active and not expired
  if (user?.subscriptionStatus === "ACTIVE") {
    // If no end date, it's a legacy lifetime subscription
    if (!user.subscriptionEndDate) {
      return true;
    }
    
    // Check if subscription is still valid
    return user.subscriptionEndDate > new Date();
  }
  
  return false;
}

/**
 * Require active subscription - redirect to pricing if not subscribed
 */
export async function requireSubscription(redirectTo: string = "/pricing") {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await getUserWithSubscription();

  if (!user) {
    redirect("/login");
  }

  // Allow admins to access everything
  if (user.role === "ADMIN") {
    return user;
  }

  // Check subscription status and expiration
  if (user.subscriptionStatus !== "ACTIVE" ||
      (user.subscriptionEndDate && user.subscriptionEndDate <= new Date())) {
    redirect(redirectTo);
  }

  return user;
}

/**
 * Check if user can access premium content
 */
export async function canAccessPremiumContent(): Promise<boolean> {
  const user = await getUserWithSubscription();
  
  // Admin always has access
  if (user?.role === "ADMIN") {
    return true;
  }
  
  // Check if subscription is active and not expired
  if (user?.subscriptionStatus === "ACTIVE") {
    // If no end date, it's a legacy lifetime subscription
    if (!user.subscriptionEndDate) {
      return true;
    }
    
    // Check if subscription is still valid
    return user.subscriptionEndDate > new Date();
  }
  
  return false;
}

/**
 * Get access level for user
 */
export async function getUserAccessLevel(): Promise<"admin" | "premium" | "free"> {
  const user = await getUserWithSubscription();

  if (user?.role === "ADMIN") {
    return "admin";
  }

  if (user?.subscriptionStatus === "ACTIVE") {
    // If no end date, it's a legacy lifetime subscription
    if (!user.subscriptionEndDate) {
      return "premium";
    }
    
    // Check if subscription is still valid
    return user.subscriptionEndDate > new Date() ? "premium" : "free";
  }

  return "free";
}
