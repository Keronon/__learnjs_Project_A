
import { Module } from '@nestjs/common';
import { RatingFilmsService } from './rating_films.service';

@Module({
  providers: [RatingFilmsService]
})
export class RatingFilmsModule {}
