
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Members :`, data, colors.reset);

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from './members.struct';
import { addFile, deleteFile } from '../files.core';
import { GetSimpleMemberDto } from './dto/get-simple-member.dto';

@Injectable()
export class MembersService {
    constructor(@InjectModel(Member) private membersDB: typeof Member) {}

    async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
        log('createMember');
        return await this.membersDB.create(createMemberDto);
    }

    async getSimpleMemberById(id: number): Promise<Member> {
        log('getSimpleMemberById');
        return await this.membersDB.findByPk(id);
    }

    async getMemberById(id: number): Promise<Member> {
        log('getMemberById');

        const member = await this.getSimpleMemberById(id);
        return member;
    }

    async getAllMembers(): Promise<Member[]> {
        log('getAllMembers');

        return await this.membersDB.findAll();
    }

    async getSimpleMembersByIds(ids: number[]): Promise<GetSimpleMemberDto[]> {
        log('getMembersByIds');

        const members: any[] = await this.membersDB.findAll({
            attributes: ['id', 'nameRU', 'nameEN'],
            where: { id: ids },
        });
        return members;
    }

    async updateImageById(id: number, image: any): Promise<Member> {
        log('updateImageByIdUser');

        const member = await this.getSimpleMemberById(id);
        if (!member) {
            throw new NotFoundException({ message: 'Member not found' });
        }

        if (!image) throw new BadRequestException({ message: 'No image to set' });

        if (member.imageName) deleteFile(member.imageName);

        member.imageName = addFile(image);
        await member.save()

        return member;
    }

    async deleteMember(id: number): Promise<number> {
        log('deleteMember');

        const member = await this.getSimpleMemberById(id);
        if (!member) {
            throw new NotFoundException({ message: 'Member not found' });
        }

        if (member.imageName) {
            deleteFile(member.imageName);
        }
        return await this.membersDB.destroy({ where: { id } });
    }
}
