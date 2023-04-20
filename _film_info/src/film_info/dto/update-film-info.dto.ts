
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateFilmInfoDto {
    @ApiProperty({ example: '1', description: 'id доп. информации о фильме' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly id: number;

    @ApiProperty({ example: 'Этот фильм о...', description: 'опиание фильма' })
    @IsString({ message: 'Must be a string' })
    readonly text: string;

    @ApiProperty({
        example: 'https://widgets.kinopoisk.ru/discovery/film/251733/trailer/18381?noAd=0&embedId=&hidden=&muted=&loop=0&autoplay=1&from=&extraTrailers=&onlyPlayer=1',
        description: 'ссылка на трейлер фильма',
    })
    @IsString({ message: 'Must be a string' })
    readonly trailerLink: string;
}
