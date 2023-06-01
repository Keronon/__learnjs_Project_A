
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class UpdateGenreDto {
    @ApiProperty({ example: 1, description: 'id жанра' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly id: number;

    @ApiProperty({ example: 'драма', description: 'название жанра фильма на русскоем', minimum: 2, maximum: 64 })
    @IsString({ message: 'Must be a string' })
    @Length(2, 64, { message: 'Must be longer then 2 and shorter then 64 symbols' })
    readonly nameRU: string;

    @ApiProperty({ example: 'drama', description: 'название жанра фильма на английском', minimum: 2, maximum: 64 })
    @IsString({ message: 'Must be a string' })
    @Length(2, 64, { message: 'Must be longer then 2 and shorter then 64 symbols' })
    readonly nameEN: string;
}
