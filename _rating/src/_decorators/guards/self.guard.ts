
import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CheckAuth } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Injectable()
export class RatingUsersSelfGuard extends RolesGuard {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const user = CheckAuth( req.headers.authorization );

            let idUser = req.params[`idUser`];
            if (!idUser) idUser = req.body.idUser;
            if ( idUser && user.id === +idUser ) return true;
            else return super.canActivate(context);
        } catch (e) {
            throw new ForbiddenException({message: 'No access'});
        }
    }
}
