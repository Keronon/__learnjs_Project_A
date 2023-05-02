
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Film_members :`, data, colors.reset);

import { Injectable, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { FilmMember } from './film_members.struct';
import { MembersService } from '../members/members.service';
import { GetFilmMembersDto } from './dto/get-film-members.dto';
import { CreateFilmMemberDto } from './dto/create-film-member.dto';
import { GetSimpleMemberDto } from '../members/dto/get-simple-member.dto';
import { QueueNames, RMQ } from '../rabbit.core';

@Injectable()
export class FilmMembersService {
    constructor(
        @InjectModel(FilmMember) private filmMembersDB: typeof FilmMember,
        private membersService: MembersService,
    ) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.FFM_cmd, QueueNames.FFM_data));
    }

    async createFilmMember(dto: CreateFilmMemberDto): Promise<FilmMember> {
        log('createFilmMember');
        return await this.filmMembersDB.create(dto);
    }

    async getMembersByFilmId(idFilm: number): Promise<GetFilmMembersDto[]> {
        log('getMembersByFilmId');

        const filmMembers: any[] = await this.filmMembersDB.findAll({
            where: { idFilm },
            include: { all: true },
        });

        for (let i = 0; i < filmMembers.length; i++) {
            filmMembers[i].dataValues.member = await this.membersService.setImageAsFile(
                filmMembers[i].dataValues.member,
            );
        }

        return filmMembers;
    }

    async getMembersByProfession(idProfession: number): Promise<GetSimpleMemberDto[]> {
        log('getMembersByProfession');

        const found = await this.filmMembersDB.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('idMember')) ,'idMember'],
            ],
            where: { idProfession },
        });

        return await this.membersService.getSimpleMembersByIds(found.map((v) => v.idMember));
    }

    async deleteFilmMember(id: number): Promise<number> {
        log('deleteFilmMember');

        const filmMember = await this.getFilmMemberById(id);
        if (!filmMember) {
            throw new NotFoundException({ message: 'Film member not found' });
        }

        return await this.filmMembersDB.destroy({ where: { id } });
    }

    async deleteMembersByFilmId(idFilm: number): Promise<number> {
        log('deleteMembersByFilmId');
        return await this.filmMembersDB.destroy({ where: { idFilm } });
    }

    async checkExistenceFilmMemberByProfessionId(idProfession: number): Promise<Boolean> {
        log('checkExistenceFilmMemberByProfessionId');

        const count = await this.filmMembersDB.count({ where: { idProfession } });
        return count > 0 ? true : false;
    }

    private async getFilmMemberById(id: number): Promise<FilmMember> {
        log('getSimpleMemberById');
        return await this.filmMembersDB.findByPk(id);
    }
}
