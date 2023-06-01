
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesService } from './roles.service';
import { User } from '../users/users.struct';
import { Role } from './roles.struct';

@Module({
    providers: [RolesService],
    imports: [SequelizeModule.forFeature([Role, User])],
    exports: [RolesService],
})
export class RolesModule {}
