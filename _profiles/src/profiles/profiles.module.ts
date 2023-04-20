
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { Profile } from './profiles.model';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [
        // Jwt Auth checker
        JwtModule.register( {
            secret: process.env.SECRET_KEY || "SECRET", // secret key

            signOptions: { expiresIn: "24h", }, // token lifetime
        } ),
        SequelizeModule.forFeature([Profile])
    ],
    exports: [ProfilesService, JwtModule],
})
export class ProfilesModule {}
