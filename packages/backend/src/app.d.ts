import { MultipartFile } from 'fastify-multipart';

declare module 'fastify' {
  interface Session {
    userId: string;
    xsrfToken: string;
  }

  interface FastifyRequest {
    multipartFiles?: AsyncIterableIterator<MultipartFile>;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'production' | 'development';
    SESSION_MAX_AGE?: string;
  }
}
