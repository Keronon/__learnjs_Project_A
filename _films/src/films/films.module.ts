
import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from './films.model';

@Module({
    controllers: [FilmsController],
    providers: [FilmsService],
    imports: [SequelizeModule.forFeature([Film])],
    exports: [FilmsService],
})
export class FilmsModule {}
