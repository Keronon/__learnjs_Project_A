
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { GetProfileDto } from '../../profiles/dto/get-profile.dto';

export class GetPrimaryCommentDto {
    @ApiProperty({ example: 1, description: 'id комментария' })
    @IsNumber({}, { message: 'Must be a number' })
    id: number;

    @ApiProperty({ example: 1, description: 'id комментируемого фильма' })
    @IsNumber({}, { message: 'Must be a number' })
    idFilm: number;

    @ApiProperty({ example: 1, description: 'id пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    idUser: number;

    @ApiProperty({ example: 1, description: 'id профиля пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    idProfile: number;

    @ApiProperty({ required: false, example: 'Комментарий о фильме', description: 'заголовок комментария' })
    @IsOptional()
    @IsString({ message: 'Must be a string' })
    @Length(10, 128, { message: 'Must be longer then 4 and shorter then 128 symbols' })
    title: string;

    @ApiProperty({ example: 'Этот фильм невозможно смотреть за едой!', description: 'текст комментария' })
    @IsString({ message: 'Must be a string' })
    @Length(10, 512, { message: 'Must be longer then 10 and shorter then 512 symbols' })
    text: string;

    @ApiProperty({ required: false, example: null, description: 'id комментируемого комментария' })
    @IsOptional()
    @IsNumber({}, { message: 'Must be a number' })
    prevId: number;

    @ApiProperty({ type: GetProfileDto, description: 'профиль пользователя' })
    profile: GetProfileDto;

    @ApiProperty({ example: 3, description: 'количество дочерних комментариев' })
    @IsNumber({}, { message: 'Must be a number' })
    childrenCount: number;
}
