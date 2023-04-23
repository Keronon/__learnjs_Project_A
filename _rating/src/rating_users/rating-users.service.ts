
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Rating_users :`, data, colors.reset );

import { Injectable } from '@nestjs/common';
import { CreateRatingUserDto } from './dto/create-rating-user.dto';
import { RatingUser } from './rating-users.struct';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class RatingUsersService {
    constructor(@InjectModel(RatingUser) private ratingUsersDB: typeof RatingUser) {}

    async getRatingUserByFilmIdAndUserId(idFilm: number, idUser: number): Promise<RatingUser> {
        // TODO : проверить токен-пользователь

        log('getRatingUserByFilmIdAndUserId');

        return await this.ratingUsersDB.findOne({
            where: {
                [Op.and]: [{ idFilm }, { idUser }],
            },
        });
    }

    async сreateRatingUser(createRatingUserDto: CreateRatingUserDto): Promise<RatingUser> {
        log('createRatingUser');

        // TODO : проверка на существование исходя из таблицы rating-films, тк там запись создаётся при создании фильма
        const idFilm = createRatingUserDto.idFilm;

        // TODO : проверка на существование исходя из токена
        const idUser = createRatingUserDto.idUser;

        // TODO : обновление записи в rating-films (и при изменении и при добавлении)
        const ratingUser = await this.getRatingUserByFilmIdAndUserId(idFilm, idUser);
        if (ratingUser) {
            ratingUser.rating = createRatingUserDto.rating;
            await ratingUser.save();

            return ratingUser;
        }

        return await this.ratingUsersDB.create(createRatingUserDto);
    }
}
