
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
    exports: [JwtModule],
    imports:
    [
        ConfigModule.forRoot({ envFilePath: '.env' }),

        JwtModule.register( {
            secret: process.env.SECRET_KEY,      // secret key
            signOptions: { expiresIn: "24h", },  // token lifetime
        } ),
    ]
})
export class JwtGlobalModule {}
