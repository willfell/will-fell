/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "willfellhoelter.com",
        pathname: "/images/**",
      },
    ],
  },
  output: "export",
  trailingSlash: true,
  // Cache headers for static assets (applied during local dev; S3 sync handles prod)
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
          publicPath: "/_next/static/files",
          outputPath: "static/files",
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;
