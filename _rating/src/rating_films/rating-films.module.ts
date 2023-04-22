
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingFilmsController } from './rating-films.controller';
import { RatingFilmsService } from './rating-films.service';
import { RatingFilm } from './rating-films.struct';

@Module({
    providers: [RatingFilmsService],
    controllers: [RatingFilmsController],
    imports: [SequelizeModule.forFeature([RatingFilm])],
    exports: [RatingFilmsService]
})
export class RatingFilmsModule {}
