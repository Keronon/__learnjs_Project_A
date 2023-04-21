
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtGlobalModule } from './jwt.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/users.struct';
import { Role } from './roles/roles.struct';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),

        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PG_HOST || 'pg',
            port: Number(process.env.PG_PORT) || 5432,
            username: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASS || 'root',
            database: process.env.PG_DB || 'DB_users',
            models: [User, Role],
            autoLoadModels: true,
            logging: false
        }),

        JwtGlobalModule,
        UsersModule,
        RolesModule,
        AuthModule,
    ]
})
export class AppModule {}
