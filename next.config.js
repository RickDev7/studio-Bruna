/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: 'N1LpI9fHAIo0az4XG',
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: 'service_qe1ai6q',
    NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID: 'template_gx390pv',
    NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID: 'template_amxl97d',
    NEXT_PUBLIC_ADMIN_EMAIL: 'bs.aestheticnails@gmail.com',
    NEXT_PUBLIC_SUPABASE_URL: 'https://ddpfougnudxkirmzzsub.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcGZvdWdudWR4a2lybXp6c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjE4MDcsImV4cCI6MjA2MzkzNzgwN30.MoBgeC2Tevc-t3JJLvU9VFtLABvi9inYPqt8jNyo4Io',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    domains: ['images.unsplash.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
};

module.exports = nextConfig; 