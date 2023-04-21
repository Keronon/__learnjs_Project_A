
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './members.struct';

@Module( {
    controllers: [ MembersController ],
    providers: [ MembersService ],
    imports:
    [
        JwtModule.register( {
            secret: process.env.SECRET_KEY || "SECRET", // secret key
            signOptions: { expiresIn: "24h", },         // token lifetime
        } ),

        SequelizeModule.forFeature([Member])
    ]
} )
export class MembersModule { }
