
import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../../countries/countries.struct';
import { Genre } from '../../genres/genres.struct';

export class GetFilmDto {
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

    @ApiProperty({ required: false, example: 9.1, description: 'рейтинг фильма' })
    readonly rating: number;

    @ApiProperty({ example: 189, description: 'длительность фильма (в минутах)' })
    readonly duration: number;

    @ApiProperty({ example: 'Этот фильм о...', description: 'опиание фильма', minimum: 4, maximum: 1024 })
    readonly text: string;

    @ApiProperty({
        required: false,
        example: 'https://widgets.kinopoisk.ru/discovery/film/81338/trailer/47737?noAd=0&embedId=&hidden=&muted=&loop=0&autoplay=1&from=&extraTrailers=&onlyPlayer=1',
        description: 'ссылка на трейлер фильма',
    })
    readonly trailerLink: string;

    @ApiProperty({ example: 1, description: 'id страны' })
    readonly idCountry: number;

    @ApiProperty({ type: Country, description: 'страна' })
    readonly country: Country;

    @ApiProperty({ type: [Genre], description: 'массив id жанров', minimum: 1, maximum: 3 })
    readonly arrGenres: Genre[];
}
