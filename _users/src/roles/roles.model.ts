import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';

interface RoleCreationAttrs {
    name: string;
    description: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Id роли' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'ADMIN', description: 'Значение роли' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string;

    @ApiProperty({ example: 'Администратор', description: 'Описание роли' })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @HasMany(() => User)
    users: User[];
}
