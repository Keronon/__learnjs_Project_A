
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Films :`, data, colors.reset);

import * as uuid from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';
import { Film } from './films.struct';
import { CreateFilmDto } from './dto/create-film.dto';
import { MembersFilterDto } from './dto/members-filter.dto';
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
            // FIXME : destroy filmInfo
            await this.filmsDB.destroy({ where: { id: idFilm } });
            throw new InternalServerErrorException({ message: 'Got empty or error response' });
        }
    }

    async getMemberFilms(idMember: number): Promise<{ idFilm, profession }[]> {
        log('getMemberFilms');

        // ! idFilm -> micro Profiles -> { idFilm, Profession }[]
        const res = await RMQ.publishReq(QueueNames.FFM_cmd, QueueNames.FFM_data, {
            id_msg: uuid.v4(),
            cmd: 'getMemberFilms',
            data: idMember,
        });
        if (!Array.isArray(res)) {
            throw new InternalServerErrorException({ message: 'Can not get member films' });
        }

        return res;
    }

    async getFilteredFilmsByMembers(arrMembersFilterDto: MembersFilterDto[]): Promise<number[]> {
        log('getFilteredFilmsByRating');

        // ! MembersFilterDto[] -> micro Profiles -> arr idsFilms
        const res = await RMQ.publishReq(QueueNames.FFM_cmd, QueueNames.FFM_data, {
            id_msg: uuid.v4(),
            cmd: 'getFilteredFilmsByMembers',
            data: arrMembersFilterDto,
        });
        if (!Array.isArray(res)) {
            throw new InternalServerErrorException({ message: 'Can not get filtered films by rating' });
        }

        return res;
    }

    async getFilteredFilmsByRating(ratingStart: number, countRatingStart: number, arrIdFilms: number[]): Promise<number[]> {
        log('getFilteredFilmsByRating');

        // ! { ratingStart, countRatingStart, arrIdFilms } -> micro Rating -> arr idsFilms
        const res = await RMQ.publishReq(QueueNames.FR_cmd, QueueNames.FR_data, {
            id_msg: uuid.v4(),
            cmd: 'getFilteredFilmsByRating',
            data: { ratingStart, countRatingStart, arrIdFilms },
        });
        if (!Array.isArray(res)) {
            throw new InternalServerErrorException({ message: 'Can not get filtered films by rating' });
        }

        return res;
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
        const res = await RMQ.publishReq(QueueNames.FR_cmd, QueueNames.FR_data, {
            id_msg: uuid.v4(),
            cmd: 'deleteRatingFilmByFilmId',
            data: idFilm,
        });
        if (res !== 1) throw new InternalServerErrorException({ message: 'Can not delete rating film' });
    }

    async deleteRatingUsers(idFilm: number): Promise<void> {
        log('deleteRatingFilm');

        // ! idFilm -> micro Rating -> rows count
        const res = await RMQ.publishReq(QueueNames.FRU_cmd, QueueNames.FRU_data, {
            id_msg: uuid.v4(),
            cmd: 'deleteRatingUsersByFilmId',
            data: idFilm,
        });
        if (isNaN(res) || res < 0) {
            throw new InternalServerErrorException({ message: 'Can not delete rating users' });
        }
    }

    async deleteFilmComments(idFilm: number): Promise<void> {
        log('deleteFilmComments');

        // ! idFilm -> micro Profiles -> rows count
        const res = await RMQ.publishReq(QueueNames.FC_cmd, QueueNames.FC_data, {
            id_msg: uuid.v4(),
            cmd: 'deleteCommentsByFilmId',
            data: idFilm,
        });
        if (isNaN(res) || res < 0) {
            throw new InternalServerErrorException({ message: 'Can not delete film comments' });
        }
    }

    async deleteFilmMembers(idFilm: number): Promise<void> {
        log('deleteFilmMembers');

        // ! idFilm -> micro Profiles -> rows count
        const res = await RMQ.publishReq(QueueNames.FFM_cmd, QueueNames.FFM_data, {
            id_msg: uuid.v4(),
            cmd: 'deleteMembersByFilmId',
            data: idFilm,
        });
        if (isNaN(res) || res < 0) {
            throw new InternalServerErrorException({ message: 'Can not delete film members' });
        }
    }
}
