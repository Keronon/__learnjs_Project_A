import { ApiProperty } from '@nestjs/swagger';
import { Model, Table, Column, DataType } from 'sequelize-typescript';

interface FilmInfoCreationAttrs {
    text: string;
    trailerLink: string;
    idUser: number;
}

@Table({ tableName: 'filmInfo' })
export class FilmInfo extends Model<FilmInfo, FilmInfoCreationAttrs> {
    @ApiProperty({ example: '1', description: 'id доп информации о фильме' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'Этот фильм о...', description: 'опиание фильма' })
    @Column({ type: DataType.STRING, allowNull: false })
    text: string;

    @ApiProperty({
        example: 'https://widgets.kinopoisk.ru/discovery/film/251733/trailer/18381?noAd=0&embedId=&hidden=&muted=&loop=0&autoplay=1&from=&extraTrailers=&onlyPlayer=1',
        description: 'ссылка на трейлер фильма',
    })
    @Column({ type: DataType.STRING, allowNull: true })
    trailerLink: string;

    @ApiProperty({ example: '1', description: 'id фильма' })
    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    idFilm: number;
}
