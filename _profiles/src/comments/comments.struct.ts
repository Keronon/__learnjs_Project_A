
import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Profile } from '../profiles/profiles.struct';

interface CommentCreationAttrs {
    idFilm: number;
    idUser: number;
    idProfile?: number;
    title?: string;
    text: string;
    prevId?: number;
}

@Table({ tableName: 'comments', paranoid: true })
export class Comment extends Model<Comment, CommentCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id комментария' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 1, description: 'id комментируемого фильма' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    idFilm: number;

    @ApiProperty({ example: 1, description: 'id пользователя-комментатора' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    idUser: number;

    @ApiProperty({ example: 1, description: 'id профиля пользователя-комментатора' })
    @Column({ type: DataType.INTEGER })
    @ForeignKey(() => Profile)
    idProfile: number;

    @ApiProperty({ required: false, example: 'Комментарий о фильме', description: 'заголовок комментария' })
    @Column({ type: DataType.TEXT })
    title: string;

    @ApiProperty({ example: 'Некоторый комментарий', description: 'комментарий фильма' })
    @Column({ type: DataType.TEXT, allowNull: false })
    text: string;

    @ApiProperty({ required: false, example: 1, description: 'id комментируемого комментария' })
    @Column({ type: DataType.INTEGER })
    prevId: number;

    @BelongsTo(() => Profile, {onDelete: 'SET NULL'})
    profile: Profile;
}
