
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
        return await this.membersDB.create(dto);
    }

    async getAllMembers (): Promise<Member[]>
    {
        return await this.membersDB.findAll();
    }

    async deleteMember ( id: number ): Promise<number>
    {
        return await this.membersDB.destroy({ where: { id } });
    }
}
