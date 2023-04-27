
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Members :`, data, colors.reset );

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from './members.struct';
import { addFile, getFile } from 'src/files.core';

@Injectable()
export class MembersService {
    constructor(@InjectModel(Member) private membersDB: typeof Member
    ) {}

    async createMember ( dto: CreateMemberDto, image: any ): Promise<Member>
    {
        log('createMember');
        return await this.membersDB.create({...dto, imageName: addFile(image)});
    }

    async getAllMembers (): Promise<any[]>
    {
        log('getAllMembers');
        const res = await this.membersDB.findAll();
        return res.map((v) =>
            this.setImageAsFile(v));
    }

    async deleteMember ( id: number ): Promise<number>
    {
        log('deleteMember');
        return await this.membersDB.destroy({ where: { id } });
    }

    private setImageAsFile(member: Member)
    {
        log('setImageAsFile');

        const data = {
            ...member,
            image: getFile(member.imageName ?? '_no_image.png')
        };
        delete data.imageName;

        return data;
    }
}
