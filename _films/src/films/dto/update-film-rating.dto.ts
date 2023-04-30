
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateFilmRatingDto {
    @ApiProperty({ example: 1, description: 'id доп. информации о фильме' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly id: number;

    @ApiProperty({ example: 8.1, description: 'новый рейтинг' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly newRating: number;
}
