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
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "@imksh/ui — Premium Component Library",
    template: "%s | @imksh/ui",
  },
  description:
    "Beautifully designed, accessible, and customizable React components for your next project.",
  keywords: ["react", "components", "ui", "design system", "tailwind"],
  openGraph: {
    type: "website",
    title: "@imksh/ui Documentation",
    description: "Premium React component library with beautiful defaults.",
  },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex h-screen flex-col" style={{ background: "var(--background)" }}>
            <Navbar />

            <div
              className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] container mx-auto overflow-hidden"
              style={{ height: "calc(100vh - 3.5rem)" }}
            >
              {/* Left Sidebar */}
              <aside
                className="z-30 hidden h-full w-full shrink-0 md:block overflow-y-auto py-6 pr-4"
                style={{
                  borderRight: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Sidebar />
              </aside>

              {/* Main Content + Right TOC */}
              <main className="relative h-full overflow-y-auto py-8 lg:py-10 pl-8 pr-4">
                <div className="mx-auto w-full min-w-0 xl:grid xl:grid-cols-[1fr_220px] gap-12">
                  <div className="min-w-0 pb-24 animate-fade-in">{children}</div>
                  {/* Right Sidebar (TOC) */}
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
