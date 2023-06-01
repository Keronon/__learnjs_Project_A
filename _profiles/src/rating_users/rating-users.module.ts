
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingUsersService } from './rating-users.service';
import { RatingUsersController } from './rating-users.controller';
import { RatingUser } from './rating-users.struct';

@Module({
    providers: [RatingUsersService],
    controllers: [RatingUsersController],
    imports: [SequelizeModule.forFeature([RatingUser])],
    exports: [RatingUsersService],
})
export class RatingUsersModule {}
