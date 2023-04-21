
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';

export class CreateFilmDto {
    @ApiProperty({ example: 'Зеленая миля', description: 'название фильма (русское)' })
    @IsString({ message: 'Must be a string' })
    readonly nameRU: string;

    @ApiProperty({ example: 'The Green Mile', description: 'название фильма (английское)' })
    @IsString({ message: 'Must be a string' })
    readonly nameEN: string;

    @ApiProperty({ example: 1999, description: 'год выпуска фильма' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly year: number;

    @ApiProperty({ example: '16+', description: 'возрастное ограничение фильма' })
    @IsString({ message: 'Must be a string' })
    readonly ageRating: string;

    @ApiProperty({ example: 189, description: 'длительность фильма (в минутах)' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly duration: number;

    @ApiProperty({ example: 'Этот фильм о...', description: 'опиание фильма' })
    @IsString({ message: 'Must be a string' })
    readonly text: string;

    @ApiProperty({
        example: 'https://widgets.kinopoisk.ru/discovery/film/81338/trailer/47737?noAd=0&embedId=&hidden=&muted=&loop=0&autoplay=1&from=&extraTrailers=&onlyPlayer=1',
        description: 'ссылка на трейлер фильма',
    })
    @IsString({ message: 'Must be a string' })
    readonly trailerLink: string;

    @ApiProperty({ example: '1', description: 'id страны' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idCountry: number;

    @ApiProperty({ example: [1, 2], description: 'массив id жанров' })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    readonly arrIdGenres: number[];
}
