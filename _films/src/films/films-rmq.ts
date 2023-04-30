
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Films :`, data, colors.reset);

import * as uuid from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';
import { Film } from './films.struct';
import { CreateFilmDto } from './dto/create-film.dto';
import { QueueNames, RMQ } from '../rabbit.core';

export class FilmsRMQ {
    constructor(private filmsDB: typeof Film) {}

    async createFilmInfo(idFilm: number, createFilmDto: CreateFilmDto): Promise<void> {
        log('createFilmInfo');

        // ! filmInfoData -> micro FilmInfo -> FilmInfo
        const res = await RMQ.publishReq(QueueNames.FFI_cmd, QueueNames.FFI_data, {
            id_msg: uuid.v4(),
            cmd: 'createFilmInfo',
            data: {
                text: createFilmDto.text,
                trailerLink: createFilmDto.trailerLink,
                idFilm: idFilm,
            },
        });
        if (Object.keys(res).length === 0) {
            await this.filmsDB.destroy({ where: { id: idFilm } });
            throw new InternalServerErrorException({ message: 'Got empty or error response' });
        }
    }

    async createRatingFilm(idFilm: number): Promise<void> {
        log('createRatingFilm');

        // ! idFilm -> micro Rating -> RatingFilm
        const res = await RMQ.publishReq(QueueNames.FR_cmd, QueueNames.FR_data, {
            id_msg: uuid.v4(),
            cmd: 'createRatingFilm',
            data: idFilm,
        });
        if (Object.keys(res).length === 0) {
            await this.filmsDB.destroy({ where: { id: idFilm } });
            throw new InternalServerErrorException({ message: 'Got empty or error response' });
        }
    }

    async deleteFilmInfo(idFilm: number): Promise<void> {
        log('deleteFilmInfo');

        // ! idFilm -> micro FilmInfo -> rows count
        const res = await RMQ.publishReq(QueueNames.FFI_cmd, QueueNames.FFI_data, {
            id_msg: uuid.v4(),
            cmd: 'deleteFilmInfoByFilmId',
            data: idFilm,
        });
        if (res !== 1) throw new InternalServerErrorException({ message: 'Can not delete film info' });
    }

    async deleteRatingFilm(idFilm: number): Promise<void> {
        log('deleteRatingFilm');

        // ! idFilm -> micro Rating -> rows count
        const res = await RMQ.publishReq(QueueNames.FR_cmd, QueueNames.FR_cmd, {
            id_msg: uuid.v4(),
            cmd: 'deleteRatingFilmByFilmId',
            data: idFilm,
        });
        if (res !== 1) throw new InternalServerErrorException({ message: 'Can not delete rating film' });
    }
}
