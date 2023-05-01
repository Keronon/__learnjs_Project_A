
import { colors } from '../../console.colors';
const log = ( data: any ) => console.log( colors.fg.magenta, `- - > GS-Rating :`, data, colors.reset );

import {
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { checkAuth } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Injectable()
export class UidGuard extends RolesGuard {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        log('canActivate');

        const req = context.switchToHttp().getRequest();
        const user = checkAuth( this.jwtService, req.headers.authorization );

        let idUser = req.params[`idUser`];
        if (!idUser) idUser = req.body.idUser;
        if ( idUser && user.id === +idUser ) return true;
        else return super.canActivate(context);
    }
}
