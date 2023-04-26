
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.struct';
import { ProfilesModule } from '../profiles/profiles.module';

@Module( {
    providers: [ CommentsService ],
    controllers: [ CommentsController ],
    imports: [
        SequelizeModule.forFeature( [ Comment ] ),

        ProfilesModule
    ]
} )
export class CommentsModule { }
