
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtGlobalModule } from './jwt.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CommentsModule } from './comments/comments.module';
import { RatingUsersModule } from './rating_users/rating-users.module';
import { Profile } from './profiles/profiles.struct';
import { Comment } from './comments/comments.struct';
import { RatingUser } from './rating_users/rating-users.struct';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    controllers: [],
    providers: [],

    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PG_HOST || 'localhost',
            port: +process.env.PG_PORT,
            username: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_DB,
            models: [Profile, Comment, RatingUser],
            autoLoadModels: true,
            logging: false
        }),

        ServeStaticModule.forRoot( { rootPath: '/root/_files', serveRoot: '/api/profiles/images'} ),

        JwtGlobalModule,
        ProfilesModule,
        CommentsModule,
        RatingUsersModule
    ],
})
export class AppModule {}
