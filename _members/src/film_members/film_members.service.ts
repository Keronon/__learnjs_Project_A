
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Film_members :`, data, colors.reset);

import * as uuid from 'uuid';
import { ConflictException, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { FilmMember } from './film_members.struct';
import { MembersService } from '../members/members.service';
import { ProfessionsService } from '../professions/professions.service';
import { GetFilmMembersDto } from './dto/get-film-members.dto';
import { CreateFilmMemberDto } from './dto/create-film-member.dto';
import { GetSimpleMemberDto } from '../members/dto/get-simple-member.dto';
import { Profession } from '../professions/professions.struct';
import { MembersFilterDto } from './dto/members-filter.dto';
import { QueueNames, RMQ } from '../rabbit.core';

@Injectable()
export class FilmMembersService {
    constructor(
        @InjectModel(FilmMember) private filmMembersDB: typeof FilmMember,
        @Inject(forwardRef(() => ProfessionsService)) private professionsService: ProfessionsService,
        private membersService: MembersService,
    ) {
        RMQ.connect().then(RMQ.setCmdConsumer(this, QueueNames.FFM_cmd, QueueNames.FFM_data));
    }

    async createFilmMember(createFilmMemberDto: CreateFilmMemberDto): Promise<FilmMember> {
        log('createFilmMember');

        const filmMember = await this.filmMembersDB.findOne({
            where: {
                [Op.and]: [
                    { idFilm: createFilmMemberDto.idFilm },
                    { idMember: createFilmMemberDto.idMember },
                    { idProfession: createFilmMemberDto.idProfession },
                ],
            },
        });
        if (filmMember) {
            throw new ConflictException({ message: 'This film member already exists' });
        }

        await this.validateFilmMemberDto(createFilmMemberDto);

        return await this.filmMembersDB.create(createFilmMemberDto);
    }

    async getMembersByFilmId(idFilm: number): Promise<GetFilmMembersDto[]> {
        log('getMembersByFilmId');

        const filmMembers: any[] = await this.filmMembersDB.findAll({
            where: { idFilm },
            include: { all: true },
        });

        return filmMembers;
    }

    async getMembersByProfession(idProfession: number): Promise<GetSimpleMemberDto[]> {
        log('getMembersByProfession');

        const found = await this.filmMembersDB.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('idMember')), 'idMember']],
            where: { idProfession },
        });

        return await this.membersService.getSimpleMembersByIds(found.map((v) => v.idMember));
    }

    async getMemberFilms(idMember: number): Promise<any[]> {
        log('getMemberFilms');

        const found = await this.filmMembersDB.findAll({
            attributes: ['idFilm'],
            where: { idMember },
            include: Profession,
        });

        return found;
    }

    async getFilteredFilmsByMembers(arrMemberFilterDto: MembersFilterDto[]): Promise<number[]> {
        log('getFilteredFilmsByMembers');

        let condition = [];
        arrMemberFilterDto.forEach((v) => {
            condition.push({ idMember: v.idMember, idProfession: v.idProfession });
        });

        const found = await this.filmMembersDB.findAll({
            attributes: ['idFilm'],
            where: { [Op.or]: condition },
        });

        const counts = {};
        found.forEach((v) => {
            counts[v.idFilm] = (counts[v.idFilm] || 0) + 1;
        });

        const res: number[] = [];
        for (let [key, value] of Object.entries(counts)) {
            if (value === arrMemberFilterDto.length) {
                res.push(+key);
            }
        }

        return res;
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

    private async validateFilmMemberDto(createFilmMemberDto: CreateFilmMemberDto): Promise<void> {
        log('validateFilmMemberDto');

        const member = await this.membersService.getSimpleMemberById(createFilmMemberDto.idMember);
        if (!member) {
            throw new NotFoundException({ message: 'Member not found' });
        }

        const profession = await this.professionsService.getProfessionById(createFilmMemberDto.idProfession);
        if (!profession) {
            throw new NotFoundException({ message: 'Profession not found' });
        }

        // ! idFilm -> micro Film -> true/false
        const res = await RMQ.publishReq(QueueNames.FMF_cmd, QueueNames.FMF_data, {
            id_msg: uuid.v4(),
            cmd: 'checkExistenceFilmById',
            data: createFilmMemberDto.idFilm,
        });
        if (!res) throw new NotFoundException({ message: 'Film not found' });
    }
}
