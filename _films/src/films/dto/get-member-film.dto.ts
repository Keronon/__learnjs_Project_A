
import { ApiProperty } from '@nestjs/swagger';
import { Film } from '../films.struct';

class Profession {
    @ApiProperty({ example: 1, description: 'id профессии' })
    id: number;

    @ApiProperty({ example: 'актёр', description: 'название профессии на русском' })
    nameRU: string;

    @ApiProperty({ example: 'actor', description: 'название профессии на английском' })
    nameEN: string;
}

export class GetMemberFilmDto {
    @ApiProperty({ type: Film, description: 'фильм' })
    readonly film: Film;

    @ApiProperty({ type: Profession, description: 'профессия' })
    readonly profession: Profession;
}
