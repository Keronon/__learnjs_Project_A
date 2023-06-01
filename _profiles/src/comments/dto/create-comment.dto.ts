
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({ example: 1, description: 'id комментируемого фильма' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idFilm: number;

    @ApiProperty({ example: 1, description: 'id пользователя-комментатора' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly idUser: number;

    @ApiProperty({
        required: false,
        example: 'Комментарий о фильме',
        description: 'заголовок комментария',
        minimum: 4,
        maximum: 128,
    })
    @IsOptional()
    @IsString({ message: 'Must be a string' })
    @Length(4, 128, { message: 'Must be longer then 4 and shorter then 128 symbols' })
    readonly title: string;

    @ApiProperty({
        example: 'Этот фильм невозможно смотреть за едой!',
        description: 'текст комментария',
        minimum: 10,
        maximum: 1024,
    })
    @IsString({ message: 'Must be a string' })
    @Length(10, 1024, { message: 'Must be longer then 10 and shorter then 1024 symbols' })
    readonly text: string;

    @ApiProperty({ required: false, example: 1, description: 'id комментируемого комментария' })
    @IsOptional()
    @IsNumber({}, { message: 'Must be a number' })
    readonly prevId: number;
}
