import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: number;
      username: string;
      expiresAt: Date;
    };
  }
}