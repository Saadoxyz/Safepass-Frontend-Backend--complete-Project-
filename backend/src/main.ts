import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins during development
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  await app.listen(4000);

  console.log(`
Application is running on: http://localhost:4000
Frontend URLs:
   - http://localhost:3000
   - http://192.168.13.1:3000

Login Credentials:
====================
Admin:     admin@safepass.com / Admin@123
Security:  security@safepass.com / Security@123
Host:      host@safepass.com / Host@123
====================
  `);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
