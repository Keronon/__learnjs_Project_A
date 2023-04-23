
import { colors } from '../../console.colors';
const log = ( data: any ) => console.log( colors.fg.crimson, `- - > GJwt-Rating :`, data, colors.reset );

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

        try {
            const user = checkAuth(context.switchToHttp().getRequest().headers.authorization);

            if (user) return true;
            return false;
        } catch (e) {
            throw new ValidationException({
                message: 'Service can not check authorization',
            });
        }
    }
}

export function checkAuth(authHeader)
{
    log('checkAuth');

    const [ token_type, token ] = authHeader.split(' ');

    if (token_type !== 'Bearer' || !token) {
        throw new UnauthorizedException({
            message: 'User unauthorized',
        });
    }

    return this.jwtService.verify(token); // check and decode token
}
