import React from "react";
import { Toaster } from "react-hot-toast";
import Scroll from "../components/common/Scroll";
import SEO from "../components/common/SEO";
import "../index.css";
import appConfig from "../config/appConfig";

export const metadata = {
  title: appConfig.app.name,
  description: "A Next.js starter kit with App Router",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content={appConfig.app.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={appConfig.app.name} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>
        <div className="min-h-screen bg-base-100 text-base-content font-sans">
          <Toaster position="top-right" />
          <Scroll />
          {children}
        </div>
      </body>
    </html>
  );
}
