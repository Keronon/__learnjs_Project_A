
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { MembersFilterDto } from './members-filter.dto';
import { TypesSorting } from '../types-sorting';

export class FilmFiltersDto {
    @ApiProperty({ required: false, type: [Number], example: [1, 2], description: 'массив id жанров', minimum: 1 })
    @IsOptional()
    @IsArray({ message: 'Must be an array' })
    @ArrayMinSize(1, { message: 'Must be at least one genre' })
    readonly arrIdGenres: number[];

    @ApiProperty({ required: false, type: [Number], example: [1, 2], description: 'массив id стран', minimum: 1 })
    @IsOptional()
    @IsArray({ message: 'Must be an array' })
    @ArrayMinSize(1, { message: 'Must be at least one country' })
    readonly arrIdCountries: number[];

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

    @ApiProperty({ required: false, example: 2000, description: 'стартовое значение года' })
    @IsOptional()
    @IsNumber({}, { message: 'Must be a number' })
    readonly yearStart: number;

    @ApiProperty({ required: false, example: 2010, description: 'конечное значение года' })
    @IsOptional()
    @IsNumber({}, { message: 'Must be a number' })
    readonly yearEnd: number;

    @ApiProperty({
        required: false, type: [MembersFilterDto],
        description: 'массив работников с профессией',
        minimum: 1
    })
    @IsOptional()
    @IsArray({ message: 'Must be an array' })
    @ArrayMinSize(1, { message: 'Must be at least one member filter' })
    readonly arrMembersFilterDto: MembersFilterDto[];

    @ApiProperty({ example: 1, description: 'номер партии данных (начало c 1)' })
    @IsNumber({}, { message: 'Must be a number' })
    @Min(1, { message: 'Must be more than 1' })
    readonly part: number;

    @ApiProperty({ required: false, enum: TypesSorting, enumName: 'Тип сортировки' })
    @IsOptional()
    @IsString({ message: 'Must be a string' })
    readonly typeSorting: TypesSorting;
}
