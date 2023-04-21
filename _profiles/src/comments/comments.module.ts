
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.struct';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports:
  [
    SequelizeModule.forFeature([Comment]),

    ProfilesModule
  ]
})
export class CommentsModule {}
