
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateProfessionDto
{
    @ApiProperty({ example: 'Актёр', description: 'название профессии', minimum: 2, maximum: 64 })
    @IsString({ message: 'Must be a string' })
    @Length(2, 64, { message: 'Must be longer then 2 and shorter then 64 symbols' })
    readonly name: string;
}
