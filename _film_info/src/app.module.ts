
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { JwtGlobalModule } from './jwt.module';
import { FilmInfoModule } from './film_info/film-info.module';
import { FilmInfo } from './film_info/film-info.struct';

@Module({
    controllers: [],
    providers: [],

    imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),

        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PG_HOST || 'localhost',
            port: +process.env.PG_PORT,
            username: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_DB,
            models: [FilmInfo],
            autoLoadModels: true,
            logging: false
        }),

        JwtGlobalModule,
        FilmInfoModule,
    ],
})
export class AppModule {}
