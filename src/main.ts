import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Удаляет все свойства, которые не указаны в DTO
    forbidNonWhitelisted: true, // Генерирует ошибку, если в запросе есть лишние свойства
    transform: true, // Преобразует входящие данные в классы
    exceptionFactory: (errors) => {
      const formattedErrors = errors.reduce((acc, error) => {
        const fieldErrors = Object.values(error.constraints);
        acc[error.property] = {
          messages: fieldErrors, 
        };
        return acc;
      }, {} as Record<string, { messages: string[] }>);
      
      return new BadRequestException({
        error: 'Bad Request',
        statusCode: 400,
        message: formattedErrors,
      });
    },
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
