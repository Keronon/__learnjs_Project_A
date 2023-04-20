
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesService } from './roles.service';
import { User } from '../users/users.model';
import { Role } from './roles.model';

@Module({
    controllers: [],
    providers: [RolesService],
    imports: [SequelizeModule.forFeature([Role, User])],
    exports: [RolesService],
})
export class RolesModule {}
