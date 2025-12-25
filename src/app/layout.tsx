import { Model } from "@/components/model";
import { AuthProvider } from "@/context/auth.context";
import { ThemeProvider } from "@/providers/theme.provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryProvider } from "@/providers/query.provider";
import { NuqsProvider } from "@/providers/nuqs.provider";
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
  title: "QuickCollab",
  description: "Collaborate Quickly and Seamlessly",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <NuqsProvider>
                <Toaster position="bottom-left" />
                <Model />
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </NuqsProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
