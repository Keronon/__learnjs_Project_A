
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateProfessionDto
{
    @ApiProperty({ example: 'Актёр', description: 'название профессии' })
    @IsString({ message: 'Must be a string' })
    @Length(4, 64, { message: 'Must be longer then 4 and shorter then 64 symbols' })
    readonly name: string;
}
