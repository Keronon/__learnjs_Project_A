
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Film_members :`, data, colors.reset);

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilmMemberDto } from './dto/create-film-member.dto';
import { InjectModel } from '@nestjs/sequelize';
import { FilmMember } from './film_members.struct';
import { MembersService } from 'src/members/members.service';
import { GetMembersByIdFilmDto } from './dto/get-members-by-idFilm.dto';
import { QueueNames, RMQ } from '../rabbit.core';

@Injectable()
export class FilmMembersService {
    constructor(@InjectModel(FilmMember) private filmMembersDB: typeof FilmMember,
                private membersService: MembersService
    ) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.FFM_cmd, QueueNames.FFM_data))
    }

    async createFilmMember(dto: CreateFilmMemberDto): Promise<FilmMember> {
        log('createFilmMember');
        return await this.filmMembersDB.create(dto);
    }

    async getMembersByIdFilm(idFilm: number): Promise<GetMembersByIdFilmDto[]> {
        log('getMembersByidFilm');

        let found: any[] = await this.filmMembersDB.findAll({ where: { idFilm } });
        found = found.map((v) => v.idMember);

        return await this.membersService.getMembersByIds(found);
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

    private async getFilmMemberById(id: number): Promise<FilmMember> {
        log('getSimpleMemberById');
        return await this.filmMembersDB.findByPk(id);
    }
}
