
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { JwtGlobalModule } from './jwt.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CommentsModule } from './comments/comments.module';
import { Profile } from './profiles/profiles.struct';
import { Comment } from './comments/comments.struct';

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
            models: [Profile, Comment],
            autoLoadModels: true,
            logging: false
        }),

        JwtGlobalModule,
        ProfilesModule,
        CommentsModule,
    ],
})
export class AppModule {}
