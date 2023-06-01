
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ example: 'ADMIN', description: 'название роли' })
    @IsString({ message: 'Must be a string' })
    readonly name: string;

    @ApiProperty({ example: 'Администратор', description: 'описание роли' })
    @IsString({ message: 'Must be a string' })
    readonly description: string;
}
