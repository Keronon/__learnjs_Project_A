import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingProfilesService } from './rating-profiles.service';
import { RatingProfilesController } from './rating-profiles.controller';
import { RatingProfile } from './rating-profiles.struct';

@Module({
    providers: [RatingProfilesService],
    controllers: [RatingProfilesController],
    imports: [SequelizeModule.forFeature([RatingProfile])],
    exports: [RatingProfilesService],
})
export class RatingUsersModule {}
