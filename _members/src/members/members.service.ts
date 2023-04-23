
import { colors } from '../console.colors';
const log = ( data: any ) => console.log( colors.fg.blue, `- - > S-Members :`, data, colors.reset );

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from './members.struct';

@Injectable()
export class MembersService {
    constructor(@InjectModel(Member) private membersDB: typeof Member
    ) {}

    async createMember ( dto: CreateMemberDto ): Promise<Member>
    {
        log('createMember');
        return await this.membersDB.create(dto);
    }

    async getAllMembers (): Promise<Member[]>
    {
        log('getAllMembers');
        return await this.membersDB.findAll();
    }

    async deleteMember ( id: number ): Promise<number>
    {
        log('deleteMember');
        return await this.membersDB.destroy({ where: { id } });
    }
}
