import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType } from 'sequelize-typescript';

interface ProfileCreationAttrs {
    profileName: string;
    idUser: number;
}

@Table({ tableName: 'profiles' })
export class Profile extends Model<Profile, ProfileCreationAttrs> {
    @ApiProperty({ example: '1', description: 'id профиля' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'Marina', description: 'имя пользователя' })
    @Column({ type: DataType.STRING, allowNull: false })
    profileName: string;

    @ApiProperty({ example: 'u12dflf.png', description: 'путь до фото профиля' })
    @Column({ type: DataType.STRING, unique: true, allowNull: true })
    imagePath: string;

    @ApiProperty({ example: '1', description: 'id пользователя' })
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    idUser: number;
}
