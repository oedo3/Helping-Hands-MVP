import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "HelpingHands - Find Volunteer Opportunities",
  description: "Discover and join local volunteer opportunities in your community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen bg-bg">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <TopBar />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <BottomNav />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
