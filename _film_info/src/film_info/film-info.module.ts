
import { Module } from '@nestjs/common';
import { FilmInfoController } from './film-info.controller';
import { FilmInfoService } from './film-info.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilmInfo } from './film-info.struct';

@Module({
    controllers: [FilmInfoController],
    providers: [FilmInfoService],
    imports: [SequelizeModule.forFeature([FilmInfo])],
    exports: [FilmInfoService],
})
export class FilmInfoModule {}
