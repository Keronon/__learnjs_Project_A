import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './profiles.model';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [SequelizeModule.forFeature([Profile])],
    exports: [ProfilesService],
})
export class ProfilesModule {}
