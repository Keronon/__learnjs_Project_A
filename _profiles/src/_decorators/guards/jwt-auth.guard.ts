
import { colors } from '../../console.colors';
const log = ( data: any ) => console.log( colors.fg.magenta, `- - > GJwt-Profiles :`, data, colors.reset );

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ValidationException } from 'src/_exceptions/validation.exception';

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

    if (!authHeader) {
        throw new UnauthorizedException({
            message: 'User unauthorized',
        });
    }

    const [ token_type, token ] = authHeader.split(' ');

    if (token_type !== 'Bearer' || !token) {
        throw new UnauthorizedException({
            message: 'User unauthorized',
        });
    }

    return jwtService.verify(token); // check and decode token
}
