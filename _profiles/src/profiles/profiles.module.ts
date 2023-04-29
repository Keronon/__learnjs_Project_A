
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { Profile } from './profiles.struct';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [SequelizeModule.forFeature([Profile])],
    exports: [ProfilesService],
})
export class ProfilesModule {}
