
import { ApiProperty } from '@nestjs/swagger';
import { GetProfileDto } from '../../profiles/dto/get-profile.dto';

export class GetPrimaryCommentDto {
    @ApiProperty({ example: 1, description: 'id комментария' })
    id: number;

    @ApiProperty({ example: 1, description: 'id комментируемого фильма' })
    idFilm: number;

    @ApiProperty({ example: 1, description: 'id пользователя' })
    idUser: number;

    @ApiProperty({ example: 1, description: 'id профиля пользователя' })
    idProfile: number;

    @ApiProperty({ required: false, example: 'Комментарий о фильме', description: 'заголовок комментария' })
    title: string;

    @ApiProperty({ example: 'Этот фильм невозможно смотреть за едой!', description: 'текст комментария' })
    text: string;

    @ApiProperty({ required: false, example: null, description: 'id комментируемого комментария' })
    prevId: number;

    @ApiProperty({ type: GetProfileDto, description: 'профиль пользователя' })
    profile: GetProfileDto;

    @ApiProperty({ example: 3, description: 'количество дочерних комментариев' })
    childrenCount: number;
}
