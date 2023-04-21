
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCountryDto {
    @ApiProperty({ example: 'США', description: 'название страны (русское)' })
    @IsString({ message: 'Must be a string' })
    readonly nameRU: string;

    @ApiProperty({ example: 'USA', description: 'название страны (английское)' })
    @IsString({ message: 'Must be a string' })
    readonly nameEN: string;
}
