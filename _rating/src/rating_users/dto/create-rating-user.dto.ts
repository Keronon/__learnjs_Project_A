
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRatingUserDto {
    @ApiProperty({ example: 7, description: 'пользовательская оценка фильма' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly rating: number;

    @ApiProperty({ example: 1, description: 'id фильма' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idFilm: number;

    @ApiProperty({ example: 1, description: 'id пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idUser: number;
}
