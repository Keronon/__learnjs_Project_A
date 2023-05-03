
import { ApiProperty } from '@nestjs/swagger';
import { GetFilmDto } from './get-film.dto';

class Profession {
    @ApiProperty({ example: 1, description: 'id профессии' })
    id: number;

    @ApiProperty({ example: 'актёр', description: 'название профессии на русском' })
    nameRU: string;

    @ApiProperty({ example: 'actor', description: 'название профессии на английском' })
    nameEN: string;
}

export class GetMemberFilmDto {
    @ApiProperty({ type: GetFilmDto, description: 'фильм' })
    readonly film: GetFilmDto;

    @ApiProperty({ type: Profession, description: 'профессия' })
    readonly profession: Profession;
}
