import type { NextConfig } from "next";

/**
 * Anti-copy hardening. None of this makes client-side JavaScript uncopyable —
 * anything shipped to a browser can be read. These settings raise the effort
 * bar: no leaked source maps, no framework fingerprint, no stray console noise,
 * and headers that stop other sites embedding the app.
 */
const nextConfig: NextConfig = {
  // Never ship readable source maps to the browser in production.
  productionBrowserSourceMaps: false,

  // Drop the "X-Powered-By: Next.js" fingerprint.
  poweredByHeader: false,

  // Strip console.* from production bundles, keep errors for diagnostics.
  compiler: {
    removeConsole: { exclude: ["error"] },
  },

  // Tree-shake big barrel packages so only used modules ship (lucide-react is
  // already optimized by default). Trims framer-motion and drei import weight.
  experimental: {
    optimizePackageImports: ["framer-motion", "@react-three/drei"],
  },

  images: {
    // Optimized variants of local static images can outlive the 4h default —
    // sources never change under the same URL.
    minimumCacheTTL: 2678400, // 31 days
  },

  async headers() {
    const securityHeaders = [
      // Block other origins from framing the site (clickjacking + content theft).
      { key: "X-Frame-Options", value: "DENY" },
      // Modern equivalent + tighter default policy.
      { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    // public/ files are not content-hashed, so "immutable" is a convention:
    // when an asset changes, rename the file (e.g. earth-orbit-2.mp4) instead
    // of replacing it in place, or returning visitors keep the old one for a year.
    const immutableAssets = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/video/:path*", headers: immutableAssets },
      { source: "/images/:path*", headers: immutableAssets },
      { source: "/globe/:path*", headers: immutableAssets },
      { source: "/icons/:path*", headers: immutableAssets },
      { source: "/brand/:path*", headers: immutableAssets },
      {
        // Legal PDFs may be replaced in place — short cache, always revalidate.
        source: "/documents/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
