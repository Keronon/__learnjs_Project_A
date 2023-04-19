
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './../auth/auth.module';
import { RolesModule } from './../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '../roles/roles.model';
import { User } from './users.model';

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
