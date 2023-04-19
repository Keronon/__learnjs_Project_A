import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { Role } from './roles/roles.model';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';

@Module({
    controllers: [],
    providers: [],

    imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),

        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PG_HOST,
            port: Number(process.env.PG_PORT) || 5432,
            username: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_DB,
            models: [User, Role],
            autoLoadModels: true,
        }),

        UsersModule,
        RolesModule,
        AuthModule,
    ],
})
export class AppModule {}
