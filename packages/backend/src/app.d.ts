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
