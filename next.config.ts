import type { NextConfig } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// Extract just the hostname for CSP connect-src
const supabaseHost = SUPABASE_URL ? new URL(SUPABASE_URL).host : "";

const securityHeaders = [
  // Prevent clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Restrict referrer info sent to third parties
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Disable browser features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), payment=(), usb=(), geolocation=(self)",
  },
  // Force HTTPS in production
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      // Only load scripts from our own origin + inline scripts Next.js needs
      "default-src 'self'",
      // Scripts: self + Next.js inline + Vercel analytics
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: self + inline (Tailwind injects styles)
      "style-src 'self' 'unsafe-inline'",
      // Images: self + data URIs + Unsplash (event photos) + OSM tiles
      "img-src 'self' data: blob: https://images.unsplash.com https://*.tile.openstreetmap.org https://*.supabase.co",
      // Fonts: self only
      "font-src 'self'",
      // API connections: self + Supabase
      `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
      // Workers (Leaflet uses web workers)
      "worker-src 'self' blob:",
      // Frames: none
      "frame-src 'none'",
      // Form targets
      "form-action 'self'",
      // Upgrade insecure requests in production
      ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Validate required env vars at build time
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
};

export default nextConfig;
