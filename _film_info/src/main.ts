import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './_decorators/pipes/validation.pipe';

async function bootstrap() {
    const PORT = process.env.PORT || 12124;
    const app = await NestFactory.create(AppModule);

    // Documentation
    const config = new DocumentBuilder()
        .setTitle('Microservice Film Info (RU)')
        .setDescription('REST API документация для микросервиса дополнительной информации о фильме')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.setGlobalPrefix('/api');
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () =>
        console.log(`\n = > micro Film Info\n = > started\n = > port : ${PORT}\n`),
    );
}
bootstrap();
