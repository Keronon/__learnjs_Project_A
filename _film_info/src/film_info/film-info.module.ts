
import { Module } from '@nestjs/common';
import { FilmInfoController } from './film-info.controller';
import { FilmInfoService } from './film-info.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilmInfo } from './film-info.struct';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [FilmInfoController],
    providers: [FilmInfoService],
    imports:
    [
        JwtModule.register( {
            secret: process.env.SECRET_KEY || "SECRET", // secret key
            signOptions: { expiresIn: "24h", },         // token lifetime
        } ),

        SequelizeModule.forFeature([FilmInfo])
    ],
    exports: [FilmInfoService],
})
export class FilmInfoModule {}
