"use client";

import { useState, useEffect } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Settings, Shield, CreditCard, Trash2, Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import { ResetDialog } from "@/components/ui/reset-dialog";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetCompanies: string[];
  experienceLevel: string;
  preferredLanguage: string;
  subscriptionStatus: string;
  subscriptionPlan: string | null;
  subscriptionEndDate: string | null;
  createdAt: string;
  lastLoginAt: string | null;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [targetCompanies, setTargetCompanies] = useState<string[]>([]);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete account states
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Reset progress states
  const [isResetting, setIsResetting] = useState(false);
  const [userPaths, setUserPaths] = useState<any[]>([]);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setExperienceLevel(data.user.experienceLevel || "");
        setPreferredLanguage(data.user.preferredLanguage || "");
        setTargetCompanies(data.user.targetCompanies || []);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    }
  };

  // Fetch user paths for data management
  const fetchUserPaths = async () => {
    try {
      const response = await fetch("/api/paths");
      if (response.ok) {
        const data = await response.json();
        setUserPaths(data.paths || []);
      }
    } catch (error) {
      console.error("Failed to fetch user paths:", error);
    }
  };

  // Handle reset all progress
  const handleResetAllProgress = async () => {
    setIsResetting(true);
    try {
      // Reset all user path progress
      for (const path of userPaths) {
        await fetch(`/api/paths/${path.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'RESET_PATH' }),
        });
      }
      
      toast.success("All learning progress has been reset");
      // Refresh data
      await fetchProfile();
      await fetchUserPaths();
    } catch (error) {
      console.error("Failed to reset all progress:", error);
      toast.error("Failed to reset progress");
    } finally {
      setIsResetting(false);
    }
  };

  // Fetch user profile and paths
  useEffect(() => {
    if (session) {
      const loadInitialData = async () => {
        await fetchProfile();
        await fetchUserPaths();
        setLoading(false);
      };
      
      loadInitialData();
    }
  }, [session]);

  // Save profile changes
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          experienceLevel,
          preferredLanguage,
          targetCompanies,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        update(); // Update session
        toast.success("Profile updated successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password changed successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setDeletingAccount(true);
    try {
      const response = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmDeletion: true,
          password: deletePassword,
        }),
      });

      if (response.ok) {
        toast.success("Account deleted successfully");
        await signOut({ callbackUrl: "/" });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account");
    } finally {
      setDeletingAccount(false);
    }
  };

  // Toggle target company
  const toggleCompany = (company: string) => {
    setTargetCompanies(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Data Management
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="text-lg">
                      {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Account Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Member since:</span>
                      <p className="font-medium">January 2024</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Last login:</span>
                      <p className="font-medium">Today</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Learning Preferences</CardTitle>
                <CardDescription>
                  Customize your learning experience and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Experience Level */}
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FRESHER">Fresher (0-1 years)</SelectItem>
                      <SelectItem value="JUNIOR">Junior (1-3 years)</SelectItem>
                      <SelectItem value="MID">Mid-level (3-5 years)</SelectItem>
                      <SelectItem value="SENIOR">Senior (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred Language */}
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Programming Language</Label>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Companies */}
                <div className="space-y-2">
                  <Label>Target Companies</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Google", "Amazon", "Meta", "Microsoft", "Netflix"].map((company) => (
                      <Badge
                        key={company}
                        variant={targetCompanies.includes(company) ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleCompany(company)}
                      >
                        {company}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Click to select/deselect companies you're preparing for.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your password and account security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <Button onClick={handleChangePassword} disabled={changingPassword}>
                    {changingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Update Password
                  </Button>
                </div>

                <Separator />

                {/* Account Actions */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Account Actions</h4>
                  <Alert>
                    <Trash2 className="h-4 w-4" />
                    <AlertDescription>
                      Deleting your account is permanent and cannot be undone.
                      All your data will be permanently removed.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="delete-password">Confirm Password</Label>
                    <Input
                      id="delete-password"
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password to confirm"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                  >
                    {deletingAccount ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Manage your learning progress and reset data if needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Resetting your progress is permanent and cannot be undone. 
                      All your completed lessons, study time, and achievements will be lost.
                    </AlertDescription>
                  </Alert>

                  {/* Reset All Progress */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Reset All Progress</h4>
                    <p className="text-sm text-gray-600">
                      This will reset all your learning progress across all paths, including:
                    </p>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                      <li>Completed lessons and progress</li>
                      <li>Study time and session history</li>
                      <li>Achievements and milestones</li>
                      <li>Current week and day progress</li>
                    </ul>
                    
                    <ResetDialog
                      pathTitle="All Learning Paths"
                      onReset={handleResetAllProgress}
                      isResetting={isResetting}
                    >
                      <Button
                        variant="destructive"
                        disabled={isResetting}
                        className="w-full"
                      >
                        {isResetting ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" />Resetting...</>
                        ) : (
                          <><RotateCcw className="w-4 h-4 mr-2" />Reset All Progress</>
                        )}
                      </Button>
                    </ResetDialog>
                  </div>

                  <Separator />

                  {/* Individual Path Resets */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Individual Path Progress</h4>
                    <p className="text-sm text-gray-600">
                      Reset progress for specific learning paths. Visit individual path pages for more granular controls.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userPaths.map((path) => (
                        <div key={path.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <span className="text-2xl mr-2">{path.emoji}</span>
                              <div>
                                <h5 className="font-medium">{path.title}</h5>
                                <p className="text-sm text-gray-500">{path.durationWeeks} weeks</p>
                              </div>
                            </div>
                            <Badge variant="secondary">
                              {path.difficulty}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/learning-paths/${path.id}`)}
                            className="w-full"
                          >
                            Manage Progress
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Statistics</CardTitle>
                  <CardDescription>
                    Overview of your learning data and activity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{userPaths.length}</div>
                      <div className="text-sm text-gray-600">Active Paths</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {userPaths.reduce((acc, path) => acc + (path.progress?.progressPercentage || 0), 0) / Math.max(userPaths.length, 1)}%
                      </div>
                      <div className="text-sm text-gray-600">Average Progress</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {userPaths.reduce((acc, path) => acc + (path.progress?.totalStudyTime || 0), 0) / 3600}h
                      </div>
                      <div className="text-sm text-gray-600">Total Study Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription & Billing</CardTitle>
                  <CardDescription>
                    Manage your subscription and view billing history.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Plan */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Current Plan</h4>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">
                            {profile?.subscriptionPlan === "LIFETIME"
                              ? "Lifetime Access"
                              : profile?.subscriptionStatus === "ACTIVE"
                                ? "Premium Plan"
                                : "Free Plan"}
                          </h5>
                          <p className="text-sm text-gray-500">
                            {profile?.subscriptionPlan === "LIFETIME"
                              ? "Lifetime access to all premium features"
                              : profile?.subscriptionStatus === "ACTIVE"
                                ? "Full access to all premium features"
                                : "Basic access to core features"}
                          </p>
                          {profile?.subscriptionEndDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              {profile.subscriptionPlan === "LIFETIME"
                                ? "Never expires"
                                : `Expires: ${new Date(profile.subscriptionEndDate).toLocaleDateString()}`}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            profile?.subscriptionStatus === "ACTIVE"
                              ? "default"
                              : profile?.subscriptionStatus === "EXPIRED"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {profile?.subscriptionStatus === "ACTIVE"
                            ? "Active"
                            : profile?.subscriptionStatus === "EXPIRED"
                              ? "Expired"
                              : "Free"}
                        </Badge>
                      </div>
                    </div>
                    {profile?.subscriptionStatus !== "ACTIVE" && (
                      <Button onClick={() => router.push("/pricing")}>
                        Upgrade Plan
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Quick Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => router.push("/profile/payment-history")}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        View Payment History
                      </Button>
                      {profile?.subscriptionStatus === "ACTIVE" && profile?.subscriptionPlan !== "LIFETIME" && (
                        <Button variant="outline" className="justify-start">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Subscription
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History Preview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Billing History</CardTitle>
                      <CardDescription>
                        View your complete payment and refund history.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/profile/payment-history")}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="mb-2">Complete billing history</p>
                    <p className="text-sm">View detailed payment records, refunds, and receipts</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
