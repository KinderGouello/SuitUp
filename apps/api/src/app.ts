import Fastify, { FastifyInstance } from 'fastify';

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  });

  // Root endpoint
  fastify.get('/', async (request, reply) => {
    return {
      message: 'SuitUp API - Welcome! 👔',
      version: '1.0.0',
      endpoints: {
        health: '/health',
      },
    };
  });

  return fastify;
}
