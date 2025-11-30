import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { ToastProvider } from "@/components/ui/toast";
import { NavigationProvider } from "@/components/providers/navigation-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepKit - Interview Preparation Platform",
  description: "Master technical interviews with structured learning paths covering DSA, System Design, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <LoadingProvider>
            <NavigationProvider>
              <ToastProvider>
                <Providers>
                  {children}
                </Providers>
              </ToastProvider>
            </NavigationProvider>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
