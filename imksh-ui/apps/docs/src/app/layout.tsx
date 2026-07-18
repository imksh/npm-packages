import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@imksh/ui/style.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { TableOfContents } from "@/components/toc";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "@imksh/ui Documentation",
  description: "Documentation for the @imksh/ui component library.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden bg-background`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex h-screen flex-col bg-background">
            <Navbar />
            <div className="flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)] container mx-auto overflow-hidden h-[calc(100vh-3.5rem)]">
              {/* Left Sidebar */}
              <aside className="z-30 hidden h-full w-full shrink-0 md:block overflow-y-auto py-6 pr-6 border-r border-border/40">
                <Sidebar />
              </aside>
              {/* Main Content + Right TOC */}
              <main className="relative h-full overflow-y-auto py-6 lg:py-8 pl-8 pr-4">
                <div className="mx-auto w-full min-w-0 xl:grid xl:grid-cols-[1fr_250px] gap-10">
                  <div className="min-w-0 pb-20">{children}</div>
                  {/* Right Sidebar (Dynamic TOC) */}
                  <div className="hidden xl:block text-sm">
                    <TableOfContents />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
