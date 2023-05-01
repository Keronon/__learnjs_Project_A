
import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './countries.struct';
import { FilmsModule } from '../films/films.module';

@Module({
    controllers: [CountriesController],
    providers: [CountriesService],
    imports: [
        SequelizeModule.forFeature([Country]),
        forwardRef(() => FilmsModule)
    ],
    exports: [CountriesService],
})
export class CountriesModule {}
