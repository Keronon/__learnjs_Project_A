
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({ example: '1', description: 'id комментируемого фильма' })
    @IsNumber({}, { message: 'Must be a number' })
    idFilm: number;

    @ApiProperty({ example: '1*', description: 'id профиля пользователя-комментатора' })
    @IsNumber({}, { message: 'Must be a number' })
    idUser: number;

    @ApiProperty({ example: 'Этот фильм невозможно смотреть за едой!', description: 'текст комментария' })
    @IsString({ message: 'Must be a string' })
    @Length(10, 512, { message: 'Must be longer then 10 and shorter then 512 symbols' })
    text: string;
}
