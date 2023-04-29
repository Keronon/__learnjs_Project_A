
import { colors } from '../console.colors';
const log = (data: any) => console.log(colors.fg.blue, `- - > S-Members :`, data, colors.reset);

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from './members.struct';
import { addFile, getFile, deleteFile } from '../files.core';
import { GetMemberDto } from './dto/get-member.dto';

@Injectable()
export class MembersService {
    constructor(@InjectModel(Member) private membersDB: typeof Member) {}

    async createMember(createMemberDto: CreateMemberDto, image: any): Promise<GetMemberDto> {
        log('createMember');

        const imageName = image ? addFile(image) : null;
        const member = await this.membersDB.create({ ...createMemberDto, imageName });
        return this.setImageAsFile(member);
    }

    async getAllMembers(): Promise<GetMemberDto[]> {
        log('getAllMembers');

        const res = await this.membersDB.findAll();
        return res.map((v) => this.setImageAsFile(v));
    }

    async getMemberByIdWithoutConversion(id: number): Promise<Member> {
        log('getMemberByIdWithoutConversion');
        return await this.membersDB.findByPk(id);
    }

    async deleteMember(id: number): Promise<number> {
        log('deleteMember');

        const member = await this.getMemberByIdWithoutConversion(id);
        if (!member) {
            throw new NotFoundException({ message: 'Member not found' });
        }

        if (member.imageName) {
            deleteFile(member.imageName);
        }
        return await this.membersDB.destroy({ where: { id } });
    }

    private setImageAsFile(member: Member): GetMemberDto {
        log('setImageAsFile');

        const data = {
            ...member.dataValues,
            image: getFile(member.imageName ?? '_no_image.png'),
        };
        delete data.imageName;

        return data;
    }
}
