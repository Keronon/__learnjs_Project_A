
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Film_info :`, data, colors.reset );

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilmInfo } from './film-info.struct';
import { CreateFilmInfoDto } from './dto/create-film-info.dto';
import { UpdateFilmInfoDto } from './dto/update-film-info.dto';
import { ExchangeNames, RMQ } from './../rabbit.core';

@Injectable()
export class FilmInfoService {
    constructor(@InjectModel(FilmInfo) private filmInfoDB: typeof FilmInfo) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, ExchangeNames.F_FI));
    }

    async createFilmInfo(createFilmInfoDto: CreateFilmInfoDto): Promise<FilmInfo> {
        log('createFilmInfo');
        return await this.filmInfoDB.create(createFilmInfoDto);
    }

    async getFilmInfoByFilmId(idFilm: number): Promise<FilmInfo> {
        log('getFilmInfoByFilmId');

        return await this.filmInfoDB.findOne({
            where: { idFilm },
        });
    }

    private async getFilmInfoById(id: number): Promise<FilmInfo> {
        log('getFilmInfoById');
        return await this.filmInfoDB.findByPk(id);
    }

    async updateFilmInfo(updateFilmInfoDto: UpdateFilmInfoDto): Promise<FilmInfo> {
        log('updateFilmInfo');

        const filmInfo = await this.getFilmInfoById(updateFilmInfoDto.id);
        if (!filmInfo) {
            throw new BadRequestException({ message: 'Film info not found' });
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
            throw new BadRequestException({ message: 'Film info not found' });
        }

        return await this.filmInfoDB.destroy({ where: { id: filmInfo.id } });
    }
}
