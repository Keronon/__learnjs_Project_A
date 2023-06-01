
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateFilmDto {
    @ApiProperty({ example: 'Зеленая миля', description: 'название фильма на русском', minimum: 1, maximum: 128 })
    @IsString({ message: 'Must be a string' })
    @Length(1, 128, { message: 'Must be longer then 1 and shorter then 128 symbols' })
    readonly nameRU: string;

    @ApiProperty({
        required: false, example: 'The Green Mile',
        description: 'название фильма на английском',
        minimum: 1, maximum: 128
    })
    @IsOptional()
    @IsString({ message: 'Must be a string' })
    @Length(1, 128, { message: 'Must be longer then 1 and shorter then 128 symbols' })
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

    @ApiProperty({ example: 1, description: 'id страны' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idCountry: number;

    @ApiProperty({ type: [Number], example: [1, 2], description: 'массив id жанров', minimum: 1 })
    @IsArray({ message: 'Must be an array' })
    @ArrayMinSize(1, {message: "Must be at least one genre"})
    readonly arrIdGenres: number[];
}
