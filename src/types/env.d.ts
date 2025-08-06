declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: string;
      NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID: string;
      NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID: string;
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: string;
      NEXT_PUBLIC_ADMIN_EMAIL: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      STRIPE_PUBLISHABLE_KEY: string;
      UPSTASH_REDIS_REST_URL: string;
      UPSTASH_REDIS_REST_TOKEN: string;
      TEST_EMAIL: string;
      ADMIN_PASSWORD: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
    }
  }
}

export {}; 