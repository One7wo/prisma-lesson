import { NestFactory, HttpAdapterHost, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('Prisma Lesson')
      .setDescription('Prisma lesson api description')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
