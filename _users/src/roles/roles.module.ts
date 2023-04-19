import { User } from '../users/users.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { RolesService } from './roles.service';
import { AuthModule } from './../auth/auth.module';

@Module({
    controllers: [],
    providers: [RolesService],
    imports: [SequelizeModule.forFeature([Role, User]), AuthModule],
    exports: [RolesService],
})
export class RolesModule {}
