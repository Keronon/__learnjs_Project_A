
import { ApiProperty } from '@nestjs/swagger';
import { GetMemberDto } from '../../members/dto/get-member.dto';
import { Profession } from '../../professions/professions.struct';

export class GetFilmMembersDto {
    @ApiProperty({ example: 1, description: 'id фильма' })
    readonly idFilm: number;

    @ApiProperty({ example: 1, description: 'id работника' })
    readonly idMember: number;

    @ApiProperty({ example: 1, description: 'id профессии' })
    readonly idProfession: number;

    @ApiProperty({ type: GetMemberDto, description: 'работник' })
    readonly member: GetMemberDto;

    @ApiProperty({ type: Profession, description: 'профессия' })
    readonly profession: Profession;
}
