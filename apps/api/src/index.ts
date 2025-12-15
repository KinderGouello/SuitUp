import { buildApp } from './app';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const start = async () => {
  try {
    const app = await buildApp();
    await app.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server ready at http://${HOST}:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
