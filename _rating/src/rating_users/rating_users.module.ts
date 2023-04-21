
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingUsersService } from './rating_users.service';
import { RatingUsersController } from './rating_users.controller';
import { RatingUser } from './rating_users.struct';

@Module( {
    providers: [ RatingUsersService ],
    controllers: [ RatingUsersController ],
    imports:
    [
        JwtModule.register( {
            secret: process.env.SECRET_KEY || "SECRET", // secret key
            signOptions: { expiresIn: "24h", },         // token lifetime
        } ),

        SequelizeModule.forFeature([RatingUser])
    ],
    exports: [JwtModule]
} )
export class RatingUsersModule { }
