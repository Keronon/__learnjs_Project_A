
import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType, BelongsTo } from 'sequelize-typescript';
import { Profile } from 'src/profiles/profiles.model';

interface CommentCreationAttrs {
    idFilm: number;
    idUser: number;
    text: string;
}

@Table({ tableName: 'comments' })
export class Comment extends Model<Comment, CommentCreationAttrs> {
    @ApiProperty({ example: '1', description: 'id комментария' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: '1', description: 'id комментируемого фильма' })
    @Column({ type: DataType.NUMBER, allowNull: false })
    idFilm: number;

    @ApiProperty({ example: '1', description: 'id профиля пользователя-комментатора' })
    @Column({ type: DataType.NUMBER, allowNull: false })
    idProfile: number;

    @ApiProperty({ example: 'Комментарий о фильме', description: 'заголовок комментария' })
    @Column({ type: DataType.STRING, allowNull: true })
    title: string;

    @ApiProperty({ example: 'Некоторый комментарий', description: 'комментарий фильма' })
    @Column({ type: DataType.STRING, allowNull: false })
    text: string;

    @ApiProperty({ example: '1', description: 'id комментируемого комментария' })
    @Column({ type: DataType.NUMBER, allowNull: true })
    prevId: number;

    @BelongsTo(() => Profile)
    profile: Profile;
}
