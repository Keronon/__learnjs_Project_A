
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingUsersModule } from 'src/rating_users/rating_users.module';
import { RatingFilmsController } from './rating_films.controller';
import { RatingFilmsService } from './rating_films.service';
import { RatingFilm } from './rating_films.struct';

@Module({
  providers: [RatingFilmsService],
  controllers: [ RatingFilmsController ],
  imports:
  [
    SequelizeModule.forFeature([RatingFilm]),

    RatingUsersModule
  ]
})
export class RatingFilmsModule {}
