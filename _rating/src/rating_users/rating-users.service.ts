
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Rating_users :`, data, colors.reset);

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RatingUser } from './rating-users.struct';
import { SetRatingUserDto } from './dto/set-rating-user.dto';
import { RatingFilmsService } from '../rating_films/rating-films.service';
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

    async setRatingUser(setRatingUserDto: SetRatingUserDto): Promise<RatingUser> {
        log('setRatingUser');

        const idFilm = setRatingUserDto.idFilm;
        const idUser = setRatingUserDto.idUser;

        const ratingUser = await this.getRatingUserByFilmIdAndUserId(idFilm, idUser);
        if (ratingUser) {
            await this.ratingFilmsService.onCreateRatingUser(
                idFilm,
                setRatingUserDto.rating,
                ratingUser.rating,
            );

            ratingUser.rating = setRatingUserDto.rating;
            await ratingUser.save();

            return ratingUser;
        }

        await this.ratingFilmsService.onCreateRatingUser(idFilm, setRatingUserDto.rating);
        return await this.ratingUsersDB.create(setRatingUserDto);
    }
}
