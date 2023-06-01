
import { colors } from '../../console.colors';
const log = ( data: any ) => console.log( colors.fg.magenta, `- - > GJwt-Members :`, data, colors.reset );

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

// blocks unauthorized users
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    // return : access right
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        log('canActivate');

        const user = checkAuth(this.jwtService, context.switchToHttp().getRequest().headers.authorization);

        if (user) return true;
        return false;
    }
}

export function checkAuth(jwtService: JwtService, authHeader)
{
    log('checkAuth');
    try {
        const [ token_type, token ] = authHeader.split(' ');
        if (token_type !== 'Bearer') throw new Error();
        return jwtService.verify(token); // check and decode token
    } catch {
        throw new UnauthorizedException({ message: 'User unauthorized' });
    }
}
