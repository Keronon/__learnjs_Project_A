
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RatingUsersService } from './rating_users.service';
import { RatingUsersController } from './rating_users.controller';
import { RatingUser } from './rating_users.struct';

@Module( {
    providers: [ RatingUsersService ],
    controllers: [ RatingUsersController ],
    imports: [
        SequelizeModule.forFeature([RatingUser])
    ]
} )
export class RatingUsersModule { }
