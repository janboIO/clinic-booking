/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://janbo.io",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://janbo.io https://*.janbo.io",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
