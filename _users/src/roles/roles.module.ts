
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './../auth/auth.module';
import { RolesService } from './roles.service';
import { User } from '../users/users.model';
import { Role } from './roles.model';

@Module({
    controllers: [],
    providers: [RolesService],
    imports: [SequelizeModule.forFeature([Role, User]), AuthModule],
    exports: [RolesService],
})
export class RolesModule {}
