
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateProfessionDto
{
    @ApiProperty({ example: 'актёр', description: 'название профессии на русском', minimum: 2, maximum: 64 })
    @IsString({ message: 'Must be a string' })
    @Length(2, 64, { message: 'Must be longer then 2 and shorter then 64 symbols' })
    readonly nameRU: string;

    @ApiProperty({ example: 'actor', description: 'название профессии на английском', minimum: 2, maximum: 64 })
    @IsString({ message: 'Must be a string' })
    @Length(2, 64, { message: 'Must be longer then 2 and shorter then 64 symbols' })
    readonly nameEN: string;
}
