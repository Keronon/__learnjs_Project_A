
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './countries.struct';

@Module({
    controllers: [CountriesController],
    providers: [CountriesService],
    imports: [
        SequelizeModule.forFeature([Country])
    ],
    exports: [CountriesService],
})
export class CountriesModule {}
