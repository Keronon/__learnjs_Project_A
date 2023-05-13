
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class SetRatingUserDto {
    @ApiProperty({ example: 7, description: 'пользовательская оценка фильма', minimum: 1, maximum: 10 })
    @IsNumber({}, { message: 'Must be a number' })
    @Min(1, { message: 'Must be more than 1' })
    @Max(10, { message: 'Must be less than 10' })
    readonly rating: number;

    @ApiProperty({ example: 1, description: 'id фильма' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idFilm: number;

    @ApiProperty({ example: 1, description: 'id пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idUser: number;
}
