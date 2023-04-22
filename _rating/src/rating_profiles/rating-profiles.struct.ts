
import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface RatingProfileCreationAttrs {
    rating: number;
    idFilm: number;
    idProfile: number;
}

@Table({ tableName: 'ratingProfiles' })
export class RatingProfile extends Model<RatingProfile, RatingProfileCreationAttrs> {
    @ApiProperty({ example: 1, description: 'id пользовательской оценки фильма' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 7, description: 'пользовательская оценка фильма' })
    @Column({ type: DataType.INTEGER })
    rating: number;

    @ApiProperty({ example: 1, description: 'id фильма' })
    @Column({ type: DataType.INTEGER })
    idFilm: number;

    @ApiProperty({ example: 1, description: 'id профиля пользователя' })
    @Column({ type: DataType.INTEGER })
    idProfile: number;
}
