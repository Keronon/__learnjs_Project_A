
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './_decorators/pipes/validation.pipe';

async function bootstrap() {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule);

    // Documentation
    const config = new DocumentBuilder()
        .setTitle('Microservice Profiles (RU)')
        .setDescription(
            'REST API документация для микросервиса профилей\n' +
            'Микросервис содержит функционал регистрации и управления профилями и комментариями',
        )
        .addBearerAuth()
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => {
        console.log(`\n = > micro Profiles\n = > started\n = > port : ${PORT}\n`);
    });
}
bootstrap();
