
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtGlobalModule } from './jwt.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/users.struct';
import { Role } from './roles/roles.struct';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PG_HOST || 'localhost',
            port: +process.env.PG_PORT,
            username: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_DB,
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
