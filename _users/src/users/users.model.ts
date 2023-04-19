import { Model, Table, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Role } from '../roles/roles.model';
import { ApiProperty } from '@nestjs/swagger';

interface UserCreationAttrs {
    email: string;
    password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: '1', description: 'user id' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'user@mail.ru', description: 'email' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: '12cdEF_*', description: 'password' })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @ApiProperty({ example: "1", description: "role id" })
    @Column({ type: DataType.INTEGER })
    @ForeignKey(() => Role)
    id_role: number;

    @BelongsTo(() => Role)
    role: Role;
}
