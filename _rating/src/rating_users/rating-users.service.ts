
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Rating_users :`, data, colors.reset);

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RatingUser } from './rating-users.struct';
import { CreateRatingUserDto } from './dto/create-rating-user.dto';
import { RatingFilmsService } from './../rating_films/rating-films.service';
import { Op } from 'sequelize';

@Injectable()
export class RatingUsersService {
    constructor(
        @InjectModel(RatingUser) private ratingUsersDB: typeof RatingUser,
        private ratingFilmsService: RatingFilmsService,
    ) {}

    async getRatingUserByFilmIdAndUserId(idFilm: number, idUser: number): Promise<RatingUser> {
        log('getRatingUserByFilmIdAndUserId');

        return await this.ratingUsersDB.findOne({
            where: {
                [Op.and]: [{ idFilm }, { idUser }],
            },
        });
    }

    async сreateRatingUser(createRatingUserDto: CreateRatingUserDto): Promise<RatingUser> {
        log('createRatingUser');

        const idFilm = createRatingUserDto.idFilm;
        const idUser = createRatingUserDto.idUser;

        const ratingUser = await this.getRatingUserByFilmIdAndUserId(idFilm, idUser);
        if (ratingUser) {
            await this.ratingFilmsService.createRatingUserToRatingFilm(
                idFilm,
                createRatingUserDto.rating,
                ratingUser.rating,
            );

            ratingUser.rating = createRatingUserDto.rating;
            await ratingUser.save();

            return ratingUser;
        }

        await this.ratingFilmsService.createRatingUserToRatingFilm(idFilm, createRatingUserDto.rating);
        return await this.ratingUsersDB.create(createRatingUserDto);
    }
}
