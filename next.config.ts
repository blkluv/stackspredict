import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DISABLE Turbopack - This was causing the build hang
  // Remove or comment out turbopack: {}
  // turbopack: {},  // <-- REMOVE THIS LINE
  
  // Server external packages for SSR compatibility - don't bundle these on server
  serverExternalPackages: [
    '@reown/appkit',
    '@reown/appkit-adapter-bitcoin',
    '@reown/appkit-core',
    '@reown/appkit-ui',
    '@reown/appkit-utils',
    '@reown/appkit-common',
    '@walletconnect/universal-provider',
  ],

  // Webpack configuration (fallback when Turbopack is disabled)
  webpack: (config, { isServer }) => {
    // Fix for wallet connect and other browser-specific packages
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
      };
    }

    // Ignore warnings from wallet connect dependencies
    config.ignoreWarnings = [
      { module: /node_modules\/@walletconnect/ },
      { module: /node_modules\/@reown/ },
      { module: /node_modules\/bufferutil/ },
      { module: /node_modules\/utf-8-validate/ },
    ];

    // Optimize bundle
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Separate wallet connect into its own chunk
          walletconnect: {
            test: /[\\/]node_modules[\\/](@walletconnect|@reown|ethers)[\\/]/,
            name: 'walletconnect',
            priority: 10,
          },
        },
      },
    };

    return config;
  },

  // Output standalone for Vercel optimization
  output: 'standalone',

  // Skip type checking during build to speed up
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optimize images
  images: {
    unoptimized: true,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || '',
  },
};

export default nextConfig;
