
import { Module } from '@nestjs/common';
import { RatingUsersService } from './rating_users.service';
import { RatingUsersController } from './rating_users.controller';

@Module({
  providers: [RatingUsersService],
  controllers: [RatingUsersController]
})
export class RatingUsersModule {}
