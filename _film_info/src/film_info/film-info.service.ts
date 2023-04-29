
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Film_info :`, data, colors.reset );

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilmInfo } from './film-info.struct';
import { CreateFilmInfoDto } from './dto/create-film-info.dto';
import { UpdateFilmInfoDto } from './dto/update-film-info.dto';
import { QueueNames, RMQ } from './../rabbit.core';

@Injectable()
export class FilmInfoService {
    constructor(@InjectModel(FilmInfo) private filmInfoDB: typeof FilmInfo) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.FFI_cmd, QueueNames.FFI_data));
    }

    async createFilmInfo(createFilmInfoDto: CreateFilmInfoDto): Promise<FilmInfo> {
        log('createFilmInfo');

        if (await this.getFilmInfoByFilmId(createFilmInfoDto.idFilm)) {
            throw new ConflictException({ message: 'This film info already exists' });
        }

        return await this.filmInfoDB.create(createFilmInfoDto);
    }

    async getFilmInfoByFilmId(idFilm: number): Promise<FilmInfo> {
        log('getFilmInfoByFilmId');

        return await this.filmInfoDB.findOne({
            where: { idFilm },
        });
    }

    async updateFilmInfo(updateFilmInfoDto: UpdateFilmInfoDto): Promise<FilmInfo> {
        log('updateFilmInfo');

        const filmInfo = await this.getFilmInfoByFilmId(updateFilmInfoDto.idFilm);
        if (!filmInfo) {
            throw new NotFoundException({ message: 'Film info not found' });
        }

        for (let key in updateFilmInfoDto) {
            filmInfo[key] = updateFilmInfoDto[key];
        }
        await filmInfo.save();

        return filmInfo;
    }

    async deleteFilmInfoByFilmId(idFilm: number): Promise<number> {
        log('deleteFilmInfoByFilmId');

        const filmInfo = await this.getFilmInfoByFilmId(idFilm);
        if (!filmInfo) {
            throw new NotFoundException({ message: 'Film info not found' });
        }

        return await this.filmInfoDB.destroy({ where: { id: filmInfo.id } });
    }
}
