
import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../members/members.struct';
import { Profession } from '../professions/professions.struct';

interface FilmMemberCreationAttrs {
    idFilm: number;
    idMember: number;
    idProfession: number;
}

@Table({ tableName: 'filmMembers' })
export class FilmMember extends Model<FilmMember, FilmMemberCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id участвовавшего в фильме' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 1, description: 'id фильма' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    idFilm: number;

    @ApiProperty({ example: 1, description: 'id работника' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => Member)
    idMember: number;

    @ApiProperty({ example: 1, description: 'id профессии' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => Profession)
    idProfession: number;

    @BelongsTo(() => Member)
    member: Member;

    @BelongsTo(() => Profession)
    profession: Profession;
}
