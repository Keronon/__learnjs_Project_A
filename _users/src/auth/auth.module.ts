import { UsersModule } from "./../users/users.module";
import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService],

  imports: [
    forwardRef(() => UsersModule),

    // Jwt Auth checker
    JwtModule.register({
      secret: process.env.SECRET_KEY || "SECRET", // secret key

      signOptions: { expiresIn: "24h", }, // token lifetime
    }),
  ],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
