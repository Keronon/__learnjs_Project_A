import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountriesModule } from 'src/countries/countries.module';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film } from './films.struct';

@Module({
    controllers: [FilmsController],
    providers: [FilmsService],
    imports:
    [
        SequelizeModule.forFeature([Film]),

        CountriesModule
    ],
    exports: [FilmsService],
})
export class FilmsModule {}
