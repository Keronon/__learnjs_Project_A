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

    // Регистрируем JwtModule внутри нашего AuthModule
    JwtModule.register({
      // Секретный ключ
      secret: process.env.SECRET_KEY || "SECRET",

      // Время жизни токена
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
