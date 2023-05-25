
import { ApiProperty } from '@nestjs/swagger';
import { Profession } from '../../professions/professions.struct';
import { Member } from 'src/members/members.struct';

export class GetFilmMembersDto {
    @ApiProperty({ example: 1, description: 'id фильма' })
    readonly idFilm: number;

    @ApiProperty({ example: 1, description: 'id работника' })
    readonly idMember: number;

    @ApiProperty({ example: 1, description: 'id профессии' })
    readonly idProfession: number;

    @ApiProperty({ type: Member, description: 'работник' })
    readonly member: Member;

    @ApiProperty({ type: Profession, description: 'профессия' })
    readonly profession: Profession;
}
