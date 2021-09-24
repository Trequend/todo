declare module 'fastify' {
  interface Session {
    userId: string;
    xsrfToken: string;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'production' | 'development';
    SESSION_MAX_AGE?: string;
  }
}
