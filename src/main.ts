import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { TimeoutInterceptor } from './common/intercepptors/timeout.interceptor';
import { WrapRespomseInterceptor } from './common/intercepptors/wrap-respomse.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true, 
    transformOptions: {
      enableImplicitConversion: true
    }
  }))
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new WrapRespomseInterceptor(), new TimeoutInterceptor);
  await app.listen(3000);
}
bootstrap(); 
