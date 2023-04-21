import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './countries.struct';

@Module({
    controllers: [CountriesController],
    providers: [CountriesService],
    imports:
    [
        JwtModule.register( {
            secret: process.env.SECRET_KEY || "SECRET", // secret key
            signOptions: { expiresIn: "24h", },         // token lifetime
        } ),

        SequelizeModule.forFeature([Country])
    ],
    exports: [CountriesService, JwtModule],
})
export class CountriesModule {}
