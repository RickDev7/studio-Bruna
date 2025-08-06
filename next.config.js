/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config, { dev, isServer }) => {
    // Forçar o webpack a usar o loader correto para arquivos JS
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      use: {
        loader: 'next-babel-loader',
        options: {
          isServer,
          hasModern: true,
          distDir: '.next',
          pagesDir: 'src/app',
          development: dev,
        },
      },
    });

    return config;
  }
}