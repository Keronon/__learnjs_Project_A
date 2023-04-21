
import { Global, Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
    exports: [JwtModule],
    imports:
    [
        JwtModule.register( {
            secret: process.env.SECRET_KEY || "SECRET", // secret key
            signOptions: { expiresIn: "24h", },         // token lifetime
        } ),
    ]
})
export class JwtGlobalModule {}
