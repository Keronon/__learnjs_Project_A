
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './_decorators/pipes/validation.pipe';

async function bootstrap ()
{
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    // Documentation
    const config = new DocumentBuilder()
        .setTitle('Microservice Films (RU)')
        .setDescription('REST API документация для микросервиса фильмов')
        .addBearerAuth()
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/films/docs', app, document);

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () =>
        console.log(`\n = > micro Films\n = > started\n = > port : ${PORT}\n`),
    );
}
bootstrap();
