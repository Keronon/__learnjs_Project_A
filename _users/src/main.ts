import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './_decorators/pipes/validation.pipe';

async function bootstrap() {
    const PORT = process.env.PORT || 12121;
    const app = await NestFactory.create(AppModule);

    // Documentation
    const config = new DocumentBuilder()
        .setTitle('Microservice Users')
        .setDescription('REST API документация для микросервиса пользователей (авторизация)')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.setGlobalPrefix('/api');
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => console.log(`MS Users started on port = ${PORT}`));
}

bootstrap();
