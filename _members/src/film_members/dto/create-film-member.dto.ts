
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateFilmMemberDto {
    @ApiProperty({ example: 1, description: 'id фильма' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idFilm: number;

    @ApiProperty({ example: 1, description: 'id работника' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idMember: number;

    @ApiProperty({ example: 1, description: 'id профессии' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idProfession: number;
}
