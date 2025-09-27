declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NEXTAUTH_SECRET: string;
      DATABASE_URL: string;
      DIRECT_URL: string;
      RESEND_API_KEY: string;
      UPSTASH_REDIS_REST_URL: string;
      UPSTASH_REDIS_REST_TOKEN: string;
      NEXT_PUBLIC_GOOGLE_MAPS_API: string;
    }
  }
}

export {};
