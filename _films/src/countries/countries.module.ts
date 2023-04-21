import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from './countries.struct';

@Module({
    controllers: [CountriesController],
    providers: [CountriesService],
    imports: [SequelizeModule.forFeature([Country])],
    exports: [CountriesService],
})
export class CountriesModule {}
