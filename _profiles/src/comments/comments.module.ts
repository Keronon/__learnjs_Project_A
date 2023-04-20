
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [ProfilesModule]
})
export class CommentsModule {}
