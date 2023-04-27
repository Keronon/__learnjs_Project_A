
import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Profile } from 'src/profiles/profiles.struct';

interface CommentCreationAttrs {
    idFilm: number;
    idProfile: number;
    title?: string;
    text: string;
    prevId?: number;
}

@Table({ tableName: 'comments' })
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

    @ApiProperty({ example: 1, description: 'id профиля пользователя-комментатора' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => Profile)
    idProfile: number;

    @ApiProperty({ required: false, example: 'Комментарий о фильме', description: 'заголовок комментария' })
    @Column({ type: DataType.STRING })
    title: string;

    @ApiProperty({ example: 'Некоторый комментарий', description: 'комментарий фильма' })
    @Column({ type: DataType.STRING, allowNull: false })
    text: string;

    @ApiProperty({ required: false, example: 1, description: 'id комментируемого комментария' })
    @Column({ type: DataType.INTEGER })
    prevId: number;

    @BelongsTo(() => Profile)
    profile: Profile;
}
