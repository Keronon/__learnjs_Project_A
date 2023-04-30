
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '../roles/roles.struct';
import { User } from './users.struct';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role]),
        RolesModule
    ],
    exports: [UsersService],
})
export class UsersModule {}
