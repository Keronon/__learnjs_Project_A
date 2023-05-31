
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/roles.struct';
import { GetRoleDto } from '../../roles/dto/get-role.dto';

export class GetUserDto {
    @ApiProperty({ example: 1, description: 'id пользователя' })
    id: number;

    @ApiProperty({ example: 'user@mail.ru', description: 'электронная почта' })
    email: string;

    @ApiProperty({ example: '12cdEF_*', description: 'пароль' })
    password: string;

    @ApiProperty({ example: 1, description: 'id роли' })
    idRole: number;

    @ApiProperty({ example: GetRoleDto, description: 'роль пользователя' })
    readonly role: Role;
}
