
import * as req from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication    } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthDto   } from '../src/auth/dto/auth.dto';
import { User      } from '../src/users/users.struct';

describe( '_users', () =>
{
    let app: INestApplication;
    let admin_token;

    beforeAll( async () =>
    {
        const moduleRef: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        await app.init();

        await new Promise(resolve => setTimeout(resolve, 300));
    } );

    describe( 'auth (e2e)', () =>
    {
        it( 'login', () =>
        {
            const authDto: AuthDto = {
                email: 'email-1@mail.ru',
                password: 'passw0rd',
            };

            return req( app.getHttpServer() )
                .post( '/api/users/login' )
                .send(authDto)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            idUser: expect.any(Number),
                            token: expect.any(String)
                        })
                    );

                    admin_token = res.body.token;
                    console.log('\n\n = = = A D M I N _ T O K E N = = = \n\n');
                    console.log(admin_token);
                } );
        } );
    });

    describe( 'users (e2e)', () =>
    {
        it( 'getAllUsers', () =>
        {
            return req( app.getHttpServer() )
                .get( '/api/users' )
                .set('Authorization', `Bearer ${admin_token}`)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    const check = new User();
                    Object.keys(res.body).every((v) => expect(check[v]).toBeDefined);
                } );
        } );

        it( 'getUserById', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/users/${1}` )
                .set('Authorization', `Bearer ${admin_token}`)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    const check = new User();
                    Object.keys(res.body).every((v) => expect(check[v]).toBeDefined);
                } );
        } );
    });
} );
