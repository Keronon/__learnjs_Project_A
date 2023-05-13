
import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../../countries/countries.struct';
import { Genre } from '../../genres/genres.struct';

export class GetFilmDto {
    @ApiProperty({ example: 1, description: 'id фильма' })
    readonly id: number;

    @ApiProperty({ example: 'Зеленая миля', description: 'название фильма на русском', minimum: 1, maximum: 128 })
    readonly nameRU: string;

    @ApiProperty({
        required: false, example: 'The Green Mile',
        description: 'название фильма на английском',
        minimum: 1, maximum: 128
    })
    readonly nameEN: string;

    @ApiProperty({ example: 1999, description: 'год выпуска фильма' })
    readonly year: number;

    @ApiProperty({ example: '16+', description: 'возрастное ограничение фильма' })
    readonly ageRating: string;

    @ApiProperty({ example: 189, description: 'длительность фильма (в минутах)' })
    readonly duration: number;

    @ApiProperty({ example: 9.1, description: 'рейтинг фильма' })
    readonly rating: number;

    @ApiProperty({ example: 40000, description: 'количество пользовательских оценок фильма' })
    readonly countRating: number;

    @ApiProperty({ example: 1, description: 'id страны' })
    readonly idCountry: number;

    @ApiProperty({ type: Country, description: 'страна' })
    readonly country: Country;

    @ApiProperty({ type: [Genre], description: 'массив id жанров', minimum: 1, maximum: 3 })
    readonly arrGenres: Genre[];
}
