
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './members.struct';

@Module({
    controllers: [MembersController],
    providers: [MembersService],
    imports: [SequelizeModule.forFeature([Member])],
    exports: [MembersService],
})
export class MembersModule {}
