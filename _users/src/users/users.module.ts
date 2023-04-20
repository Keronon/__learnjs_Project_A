
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from './../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '../roles/roles.model';
import { User } from './users.model';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        // Jwt Auth checker
        JwtModule.register( {
            secret: process.env.SECRET_KEY || "SECRET", // secret key

            signOptions: { expiresIn: "24h", }, // token lifetime
        } ),
        SequelizeModule.forFeature([User, Role]),
        RolesModule,
    ],
    exports: [UsersService, JwtModule],
})
export class UsersModule {}
