
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtGlobalModule } from './jwt.module';
import { MembersModule } from './members/members.module';
import { ProfessionsModule } from './professions/professions.module';
import { Member } from './members/members.struct';
import { Profession } from './professions/professions.struct';
import { FilmMembersModule } from './film_members/film_members.module';
import { FilmMember } from './film_members/film_members.struct';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module( {
    controllers: [],
    providers: [],
    imports:
    [
        SequelizeModule.forRoot( {
            dialect: 'postgres',
            host: process.env.PG_HOST || 'localhost',
            port: +process.env.PG_PORT,
            username: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_DB,
            models: [ Member, Profession, FilmMember ],
            autoLoadModels: true,
            logging: false
        } ),

        ServeStaticModule.forRoot( { rootPath: '/root/_files', serveRoot: '/api/members/images'} ),

        JwtGlobalModule,
        MembersModule,
        ProfessionsModule,
        FilmMembersModule
    ],
} )
export class AppModule { }
