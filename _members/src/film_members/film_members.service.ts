
import { Injectable } from '@nestjs/common';
import { CreateFilmMemberDto } from './dto/create-film-member.dto';
import { InjectModel } from '@nestjs/sequelize';
import { FilmMember } from './film_members.struct';

@Injectable()
export class FilmMembersService {
    constructor(@InjectModel(FilmMember) private filmMembersDB: typeof FilmMember
    ) {}

    async createFilmMember ( dto: CreateFilmMemberDto ): Promise<FilmMember>
    {
        return await this.filmMembersDB.create(dto);
    }

    async deleteFilmMember ( id: number ): Promise<boolean>
    {
        await this.filmMembersDB.destroy({ where: { id } });
        return true;
    }
}
