
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Rating_films :`, data, colors.reset);

import * as uuid from 'uuid';
import { ConflictException,
         Injectable,
         InternalServerErrorException,
         NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { RatingFilm } from './rating-films.struct';
import { RatingFilterDto } from './dto/rating-filter.dto';
import { QueueNames, RMQ } from '../rabbit.core';

@Injectable()
export class RatingFilmsService {
    constructor(@InjectModel(RatingFilm) private ratingFilmsDB: typeof RatingFilm) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.FR_cmd, QueueNames.FR_data));
    }

    async getRatingFilmCountByFilmId(idFilm: number): Promise<number> {
        log('getRatingFilmCountByFilmId');

        const ratingFilm = await this.getRatingFilmByFilmId(idFilm);
        if (!ratingFilm) {
            throw new NotFoundException({ message: 'Rating film not found' });
        }

        return ratingFilm.count;
    }

    async getFilteredFilmsByRating(ratingFilterDto: RatingFilterDto): Promise<number[]> {
        log('getFilteredFilmsByRating');

        const condition = [];
        if (ratingFilterDto.arrIdFilms) condition.push({ idFilm: ratingFilterDto.arrIdFilms });
        if (ratingFilterDto.ratingStart) {
            condition.push({ ratingFilm: { [Op.gte]: ratingFilterDto.ratingStart } });
        }
        if (ratingFilterDto.countRatingStart) {
            condition.push({ count: { [Op.gte]: ratingFilterDto.countRatingStart } });
        }

        const found = await this.ratingFilmsDB.findAll({
            attributes: ['idFilm'],
            where: condition,
        });

        return found.map((v) => v.idFilm);
    }

    async onCreateRatingUser(idFilm: number, newRatingUser: number, oldRatingUser: number = 0): Promise<RatingFilm> {
        log('onCreateRatingUser');

        let ratingFilm = await this.getRatingFilmByFilmId(idFilm);
        if (!ratingFilm) {
            throw new NotFoundException({ message: 'Rating film not found' });
        }

        let sumRatings: number;
        if (!oldRatingUser) {
            sumRatings = ratingFilm.ratingCurrent * ratingFilm.count + newRatingUser;
            ratingFilm.count++;
        } else {
            sumRatings = ratingFilm.ratingCurrent * ratingFilm.count - oldRatingUser + newRatingUser;
        }

        ratingFilm.ratingCurrent = sumRatings / ratingFilm.count;

        const ratingCurrent = Math.round(ratingFilm.ratingCurrent * 10) / 10;
        if (ratingFilm.ratingFilm !== ratingCurrent) {
            ratingFilm.ratingFilm = ratingCurrent;

            // ! { id, newRating } -> micro Film -> true
            const res = await RMQ.publishReq(QueueNames.RF_cmd, QueueNames.RF_data, {
                id_msg: uuid.v4(),
                cmd: 'updateFilmRating',
                data: { id: idFilm, newRating: ratingFilm.ratingFilm },
            });
            if (res !== true)
                throw new InternalServerErrorException({ message: 'Can not update film rating' });
        }

        ratingFilm = await ratingFilm.save();
        return ratingFilm;
    }

    async deleteRatingFilmByFilmId(idFilm: number): Promise<number> {
        log('deleteRatingFilmByFilmId');

        if (!(await this.checkExistenceRating(idFilm))) {
            throw new NotFoundException({ message: 'Rating film not found' });
        }

        return await this.ratingFilmsDB.destroy({ where: { idFilm } });
    }

    private async checkExistenceRating(idFilm: number): Promise<boolean> {
        log('checkExistenceRating');

        const count = await this.ratingFilmsDB.count({ where: { idFilm } });
        return count > 0 ? true : false;
    }

    private async getRatingFilmByFilmId(idFilm: number): Promise<RatingFilm> {
        log('getRatingFilmByFilmId');
        return await this.ratingFilmsDB.findOne({ where: { idFilm } });
    }
}
