
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { JwtGlobalModule } from './jwt.module';
import { RatingFilmsModule } from './rating_films/rating-films.module';
import { RatingUsersModule } from './rating_users/rating-users.module';
import { RatingFilm } from './rating_films/rating-films.struct';
import { RatingUser } from './rating_users/rating-users.struct';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),

        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PG_HOST || 'pg',
            port: Number(process.env.PG_PORT) || 5432,
            username: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASS || 'root',
            database: process.env.PG_DB || 'DB_rating',
            models: [RatingFilm, RatingUser],
            autoLoadModels: true,
            logging: false,
        }),

        JwtGlobalModule,
        RatingFilmsModule,
        RatingUsersModule,
    ],
})
export class AppModule {}
