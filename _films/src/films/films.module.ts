
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountriesModule } from './../countries/countries.module';
import { GenresModule } from './../genres/genres.module';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film } from './films.struct';

@Module({
    controllers: [FilmsController],
    providers: [FilmsService],
    imports:
    [
        SequelizeModule.forFeature([Film]),

        CountriesModule,
        GenresModule
    ],
    exports: [FilmsService],
})
export class FilmsModule {}
