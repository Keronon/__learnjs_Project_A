
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGenreDto {
    @ApiProperty({ example: 'драма', description: 'название жанра фильма (русское)' })
    @IsString({ message: 'Must be a string' })
    readonly nameRU: string;

    @ApiProperty({ example: 'drama', description: 'название жанра фильма (английское)' })
    @IsString({ message: 'Must be a string' })
    readonly nameEN: string;
}
