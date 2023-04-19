import { AuthModule } from './../auth/auth.module';
import { RolesModule } from './../roles/roles.module';
import { Role } from '../roles/roles.model';
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role]),
        RolesModule,

        forwardRef(() => AuthModule),
    ],
    exports: [UsersService],
})
export class UsersModule {}
