
import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { Profile } from './profiles.struct';
import { CommentsModule } from '../comments/comments.module';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [
        SequelizeModule.forFeature([Profile]),
        CommentsModule
    ],
    exports: [ProfilesService],
})
export class ProfilesModule {}
