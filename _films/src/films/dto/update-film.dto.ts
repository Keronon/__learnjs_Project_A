
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateFilmDto {
    @ApiProperty({ example: 1, description: 'id доп. информации о фильме' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly id: number;

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

    @ApiProperty({ example: 1, description: 'id страны' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idCountry: number;

    @ApiProperty({ example: [1, 2], description: 'массив id жанров' })
    @IsArray()
    @ArrayMinSize(1, {message: "Must be at least one genre"})
    @ArrayMaxSize(3, {message: "Must not be more then 3 genres"})
    readonly arrIdGenres: number[];
}
