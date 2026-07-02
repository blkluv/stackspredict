import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FORCE WEBPACK (fixes Next 16 Turbopack conflict)
  experimental: {
    turbo: false,
  },

  serverExternalPackages: [
    "@reown/appkit",
    "@reown/appkit-adapter-bitcoin",
    "@reown/appkit-core",
    "@reown/appkit-ui",
    "@reown/appkit-utils",
    "@reown/appkit-common",
    "@walletconnect/universal-provider",
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify"),
        buffer: require.resolve("buffer/"),
        process: require.resolve("process/browser"),
      };
    }

    config.ignoreWarnings = [
      { module: /node_modules\/@walletconnect/ },
      { module: /node_modules\/@reown/ },
      { module: /node_modules\/bufferutil/ },
      { module: /node_modules\/utf-8-validate/ },
    ];

    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          walletconnect: {
            test: /[\\/]node_modules[\\/](@walletconnect|@reown|ethers)[\\/]/,
            name: "walletconnect",
            priority: 10,
          },
        },
      },
    };

    return config;
  },

  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || "",
  },
};

export default nextConfig;
