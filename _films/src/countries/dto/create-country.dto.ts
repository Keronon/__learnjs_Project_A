
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCountryDto {
    @ApiProperty({ example: 'США', description: 'название страны на русском', minimum: 2, maximum: 64 })
    @IsString({ message: 'Must be a string' })
    @Length(2, 64, { message: 'Must be longer then 2 and shorter then 64 symbols' })
    readonly nameRU: string;

    @ApiProperty({ example: 'USA', description: 'название страны на английском', minimum: 2, maximum: 64 })
    @IsString({ message: 'Must be a string' })
    @Length(2, 64, { message: 'Must be longer then 2 and shorter then 64 symbols' })
    readonly nameEN: string;
}
