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

    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
