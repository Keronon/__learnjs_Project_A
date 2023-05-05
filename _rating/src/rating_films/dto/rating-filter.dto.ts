
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, Max, Min, ArrayMinSize } from 'class-validator';

export class RatingFilterDto {
    @ApiProperty({
        required: false, example: 8.5,
        description: 'стартовое значение рейтинга',
        minimum: 1, maximum: 10
    })
    @IsOptional()
    @IsNumber({}, { message: 'Must be a number' })
    @Min(1, { message: 'Must be more than 1' })
    @Max(10, { message: 'Must be less than 10' })
    readonly ratingStart: number;

    @ApiProperty({
        required: false,
        example: 1000,
        description: 'стартовое значение количества пользовательских оценок',
    })
    @IsOptional()
    @IsNumber({}, { message: 'Must be a number' })
    readonly countRatingStart: number;

    @ApiProperty({ required: false, type: [Number], example: [1, 2], description: 'массив id фильмов', minimum: 1 })
    @IsOptional()
    @IsArray({ message: 'Must be an array' })
    @ArrayMinSize(1, {message: "Must be at least one id film"})
    readonly arrIdFilms: number[];
}
