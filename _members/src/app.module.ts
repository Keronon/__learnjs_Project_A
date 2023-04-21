
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { MembersModule } from './members/members.module';
import { ProfessionsModule } from './professions/professions.module';
import { Member } from './members/members.struct';
import { Profession } from './professions/professions.struct';

@Module( {
    controllers: [],
    providers: [],
    imports:
    [
        ConfigModule.forRoot( { envFilePath: '.env' } ),

        SequelizeModule.forRoot( {
            dialect: 'postgres',
            host: process.env.PG_HOST || 'pg',
            port: Number( process.env.PG_PORT ) || 5432,
            username: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASS || 'root',
            database: process.env.PG_DB || 'DB_members',
            models: [ Member, Profession ],
            autoLoadModels: true,
            logging: false
        } ),

        MembersModule,
        ProfessionsModule
    ],
} )
export class AppModule { }
