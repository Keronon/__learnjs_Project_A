
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilmInfo } from './film-info.model';
import { CreateFilmInfoDto } from './dto/create-film-info.dto';
import { UpdateFilmInfoDto } from './dto/update-film-info.dto';

@Injectable()
export class FilmInfoService {
    constructor(@InjectModel(FilmInfo) private filmInfoDB: typeof FilmInfo) {}

    async getFilmInfoByFilmId(idFilm: number): Promise<FilmInfo> {
        return await this.filmInfoDB.findOne({
            where: { idFilm },
        });
    }

    async createFilmInfo(createFilmInfoDto: CreateFilmInfoDto): Promise<FilmInfo> {
        return await this.filmInfoDB.create(createFilmInfoDto);
    }

    async updateFilmInfo(updateFilmInfoDto: UpdateFilmInfoDto): Promise<FilmInfo> {
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

    async deleteFilmInfoById(id: number): Promise<number> {
        const filmInfo = await this.getFilmInfoById(id);
        if (!filmInfo) {
            throw new BadRequestException({ message: 'Film info not found' });
        }

        return await this.filmInfoDB.destroy({ where: { id } });
    }

    private async getFilmInfoById(id: number): Promise<FilmInfo> {
        return await this.filmInfoDB.findByPk(id);
    }
}
