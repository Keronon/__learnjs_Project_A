
import { ApiProperty } from '@nestjs/swagger';
import { GetProfileDto } from '../../profiles/dto/get-profile.dto';

export class GetPrimaryCommentDto {
    @ApiProperty({ example: 1, description: 'id комментария' })
    readonly id: number;

    @ApiProperty({ example: 1, description: 'id комментируемого фильма' })
    readonly idFilm: number;

    @ApiProperty({ example: 1, description: 'id пользователя' })
    readonly idUser: number;

    @ApiProperty({ example: 1, description: 'id профиля пользователя' })
    readonly idProfile: number;

    @ApiProperty({ required: false, example: 'Комментарий о фильме', description: 'заголовок комментария' })
    readonly title: string;

    @ApiProperty({ example: 'Этот фильм невозможно смотреть за едой!', description: 'текст комментария' })
    readonly text: string;

    @ApiProperty({ required: false, example: null, description: 'id комментируемого комментария' })
    readonly prevId: number;

    @ApiProperty({ type: GetProfileDto, description: 'профиль пользователя' })
    readonly profile: GetProfileDto;

    @ApiProperty({ example: 3, description: 'количество дочерних комментариев' })
    readonly childrenCount: number;
}
