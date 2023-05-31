
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/roles.struct';
import { GetRoleDto } from '../../roles/dto/get-role.dto';

export class GetAuthDto {
    @ApiProperty({ example: 1, description: 'id пользователя' })
    readonly idUser: number;

    @ApiProperty({ example: GetRoleDto, description: 'роль пользователя' })
    readonly role: Role;

    @ApiProperty({ example: 'h123fgh213fh12j31jh23.h12g3h1', description: 'токен' })
    readonly token: string;
}
