
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Rating_users :`, data, colors.reset);

import * as uuid from 'uuid';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RatingUser } from './rating-users.struct';
import { SetRatingUserDto } from './dto/set-rating-user.dto';
import { Op } from 'sequelize';
import { QueueNames, RMQ } from '../rabbit.core';

@Injectable()
export class RatingUsersService {
    constructor(@InjectModel(RatingUser) private ratingUsersDB: typeof RatingUser) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.FR_cmd, QueueNames.FR_data));
    }

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
            await this.updateRatingFilm(idFilm, setRatingUserDto.rating, ratingUser.rating);

            ratingUser.rating = setRatingUserDto.rating;
            await ratingUser.save();

            return ratingUser;
        }

        await this.updateRatingFilm(idFilm, setRatingUserDto.rating);
        return await this.ratingUsersDB.create(setRatingUserDto);
    }

    async deleteRatingUsersByFilmId(idFilm: number): Promise<number> {
        log('deleteRatingUsersByFilmId');
        return await this.ratingUsersDB.destroy({ where: { idFilm } });
    }

    private async updateRatingFilm(idFilm: number, newRatingUser: number, oldRatingUser: number = null): Promise<boolean> {
        log('updateRatingFilm');

        // ! { id, newRatingUser, oldRatingUser } -> micro Film -> true
        const res = await RMQ.publishReq(QueueNames.RF_cmd, QueueNames.RF_data, {
            id_msg: uuid.v4(),
            cmd: 'updateFilmRating',
            data: { id: idFilm, newRatingUser, oldRatingUser },
        });
        if (res !== true) throw new InternalServerErrorException({ message: 'Can not update film rating' });

        return res;
    }
}
