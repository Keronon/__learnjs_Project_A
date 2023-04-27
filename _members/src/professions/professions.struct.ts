
import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { FilmMember } from 'src/film_members/film_members.struct';

interface ProfessionCreationAttrs {
    name: string;
}

@Table({ tableName: 'professions' })
export class Profession extends Model<Profession, ProfessionCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id профессии' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'Актёр', description: 'название профессии' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string;

    @HasMany(() => FilmMember)
    filmMember: FilmMember[];
}
