import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Rating_films :`, data, colors.reset);

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RatingFilm } from './rating-films.struct';

@Injectable()
export class RatingFilmsService {
    constructor(@InjectModel(RatingFilm) private ratingFilmsDB: typeof RatingFilm) {}

    async getRatingFilmCountByFilmId(idFilm: number): Promise<number> {
        log('getRatingFilmCountByFilmId');

        const ratingFilm = await this.getRatingFilmByFilmId(idFilm);
        if (!ratingFilm) {
            throw new BadRequestException({ message: 'Rating film not found' });
        }

        return ratingFilm.count;
    }

    async createRatingFilm(idFilm: number): Promise<RatingFilm> {
        log('createRatingFilm');

        if (await this.checkExistenceRating(idFilm)) {
            throw new BadRequestException({ message: 'This rating film already exists' });
        }

        const ratingFilmData = {
            count: 0,
            ratingFilm: 0,
            ratingCurrent: 0,
            idFilm,
        };

        return await this.ratingFilmsDB.create(ratingFilmData);
    }

    async createRatingUserToRatingFilm(
        idFilm: number,
        newRatingUser: number,
        oldRatingUser: number = 0,
    ): Promise<RatingFilm> {
        log('createRatingUserToRatingFilm');

        const ratingFilm = await this.getRatingFilmByFilmId(idFilm);
        if (!ratingFilm) {
            throw new BadRequestException({ message: 'Rating film not found' });
        }

        let sumRatings: number;
        if (!oldRatingUser) {
            sumRatings = ratingFilm.ratingCurrent * ratingFilm.count + newRatingUser;
            ratingFilm.count++;
        } else {
            sumRatings = ratingFilm.ratingCurrent * ratingFilm.count - oldRatingUser + newRatingUser;
        }

        ratingFilm.ratingCurrent = sumRatings / ratingFilm.count;
        await ratingFilm.save();

        if (ratingFilm.ratingFilm !== Math.round(ratingFilm.ratingCurrent)) {
            ratingFilm.ratingFilm = Math.round(ratingFilm.ratingCurrent);
            // TODO: отправка в микро Films нового рейтинга
        }

        return ratingFilm;
    }

    async deleteRatingFilmByFilmId(idFilm: number): Promise<number> {
        log('deleteRatingFilmByFilmId');

        if (!(await this.checkExistenceRating(idFilm))) {
            throw new BadRequestException({ message: 'Rating film not found' });
        }

        return await this.ratingFilmsDB.destroy({ where: { idFilm } });
    }

    private async checkExistenceRating(idFilm: number): Promise<boolean> {
        log('checkExistenceRating');

        const count = await this.ratingFilmsDB.count({
            where: { idFilm },
        });

        return count > 0 ? true : false;
    }

    private async getRatingFilmByFilmId(idFilm: number): Promise<RatingFilm> {
        log('getRatingFilmByFilmId');

        return await this.ratingFilmsDB.findOne({
            where: { idFilm },
        });
    }
}
