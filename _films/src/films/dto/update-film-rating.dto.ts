
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateFilmRatingDto {
    @ApiProperty({ example: 1, description: 'id доп. информации о фильме' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly id: number;

    @ApiProperty({ example: 8.1, description: 'новый рейтинг пользователя' })
    @IsNumber({}, { message: 'Must be a number' })
    readonly newRatingUser: number;

    @ApiProperty({ required: false, example: 5.5, description: 'старый рейтинг пользователя' })
    @IsOptional()
    @IsNumber({}, { message: 'Must be a number' })
    readonly oldRatingUser: number;
}
