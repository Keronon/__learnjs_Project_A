
import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { FilmMember } from '../film_members/film_members.struct';

interface MemberCreationAttrs {
    nameRU: string;
    nameEN?: string;
    text: string;
    imageName?: string;
}

@Table({ tableName: 'members' })
export class Member extends Model<Member, MemberCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id работника' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'Киану Ривз', description: 'имя работника на русском' })
    @Column({ type: DataType.STRING, allowNull: false })
    nameRU: string;

    @ApiProperty({ example: 'Keanu Reeves', description: 'имя работника на английском' })
    @Column({ type: DataType.STRING })
    nameEN: string;

    @ApiProperty({
        example: 'По-гавайски имя Keanu означает «прохладный ветер над горами».',
        description: 'описание работника',
    })
    @Column({ type: DataType.STRING, allowNull: false })
    text: string;

    @ApiProperty({ example: 'ss343f3f2.jpg', description: 'фото работника' })
    @Column({ type: DataType.STRING, unique: true })
    imageName: string;

    @HasMany(() => FilmMember)
    filmMember: FilmMember[];
}
