
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateFilmInfoDto {
    @ApiProperty({ example: 'Этот фильм о...', description: 'опиание фильма', minimum: 4, maximum: 1024 })
    @IsString({ message: 'Must be a string' })
    @Length(4, 1024, { message: 'Must be longer then 4 and shorter then 1024 symbols' })
    readonly text: string;

    @ApiProperty({
        required: false,
        example: 'https://widgets.kinopoisk.ru/discovery/film/81338/trailer/47737?noAd=0&embedId=&hidden=&muted=&loop=0&autoplay=1&from=&extraTrailers=&onlyPlayer=1',
        description: 'ссылка на трейлер фильма',
    })
    @IsOptional()
    @IsString({ message: 'Must be a string' })
    readonly trailerLink: string;

    @ApiProperty({ example: 1, description: 'id фильма' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idFilm: number;
}
