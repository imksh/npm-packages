import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/external/:path*",
        destination: "http://localhost:5000/api/:path*", // Example backend URL
      },
    ];
  },
};

export default withPWA(nextConfig);
