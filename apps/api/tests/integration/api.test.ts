import { type FastifyInstance } from 'fastify';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { buildApp } from '../../src/app';

describe('API Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('SuitUp API');
      expect(body).toHaveProperty('version');
      expect(body).toHaveProperty('endpoints');
    });

    it('should return JSON content type', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/',
      });

      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('status', 'ok');
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('uptime');
      expect(body).toHaveProperty('environment');
    });

    it('should return valid timestamp', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      const body = JSON.parse(response.body);
      const timestamp = new Date(body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should return positive uptime', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      const body = JSON.parse(response.body);
      expect(body.uptime).toBeGreaterThan(0);
    });

    it('should return environment', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      const body = JSON.parse(response.body);
      expect(body.environment).toBe('test'); // Set in test setup
    });
  });

  describe('Error handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/unknown-route',
      });

      expect(response.statusCode).toBe(404);
    });

    it('should return 404 for unknown POST routes', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/unknown-route',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
