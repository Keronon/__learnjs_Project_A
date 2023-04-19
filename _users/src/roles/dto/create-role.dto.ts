import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ example: 'ADMIN', description: 'role name' })
    @IsString({ message: 'Must be a string' })
    readonly name: string;

    @ApiProperty({ example: 'Администратор', description: 'role description' })
    @IsString({ message: 'Must be a string' })
    readonly description: string;
}
