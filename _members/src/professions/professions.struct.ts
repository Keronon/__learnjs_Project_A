
import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { FilmMember } from '../film_members/film_members.struct';

interface ProfessionCreationAttrs {
    nameRU: string;
    nameEN: string;
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

    @ApiProperty({ example: 'актёр', description: 'название профессии на русском' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    nameRU: string;

    @ApiProperty({ example: 'actor', description: 'название профессии на английском' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    nameEN: string;

    @HasMany(() => FilmMember)
    filmMember: FilmMember[];
}
