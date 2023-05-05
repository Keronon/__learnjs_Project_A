
import * as req from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule        } from '../src/app.module';
import { GetProfileDto    } from '../src/profiles/dto/get-profile.dto';
import { AccountDto       } from '../src/profiles/dto/account.dto';
import { RegistrationDto  } from '../src/profiles/dto/registration.dto';

describe( 'host/api/profiles/', () =>
{
    let app: INestApplication;
    let admin_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsLTFAbWFpbC5ydSIsImlkIjoxLCJyb2xlIjp7ImlkIjoxLCJuYW1lIjoiQURNSU4iLCJkZXNjcmlwdGlvbiI6ItCw0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiY3JlYXRlZEF0IjoiMjAyMy0wNS0wM1QyMDoxMjo1Ni4wODVaIiwidXBkYXRlZEF0IjoiMjAyMy0wNS0wM1QyMDoxMjo1Ni4wODVaIn0sImlhdCI6MTY4MzE0NTAyNSwiZXhwIjoxNjgzMjMxNDI1fQ.wkHhXfdyuKxFU-qmWodBdTHYRVk5tE9MBU6wxOpKbvY';
    let admin_idUser;
    let admin_profile;

    beforeAll( async () =>
    {
        const moduleRef: TestingModule = await Test.createTestingModule( {
            imports: [ AppModule ],
        } ).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    } );

    afterAll( async () => { await app.close(); } );

    it( 'regUser', () =>
    {
        const registrationDto: RegistrationDto = {
            profileName: 'name1',
            email: 'mail.a@mail.ru',
            password: 'password',
        }

        return req( app.getHttpServer() )
            .post( '/api/profiles/reg/user' )
            .send(registrationDto)
            .expect( 200 )
            .expect( (res: req.Response) =>
            {
                expect( 'idUser' in res.body && typeof(res.body.idUser) === 'number' )
                    .toBe( true );
                expect( 'token'  in res.body && typeof(res.body.token)  === 'string' )
                    .toBe( true );
            } );
    } );

    it( 'regAdmin', () =>
    {
        const registrationDto: RegistrationDto = {
            profileName: 'name2',
            email: 'mail.b@mail.ru',
            password: 'password',
        }

        return req( app.getHttpServer() )
            .post( '/api/profiles/reg/admin' )
            .set('Authorization', `Bearer ${admin_token}`)
            .send(registrationDto)
            .expect( 200 )
            .expect( (res: req.Response) =>
            {
                expect( 'idUser' in res.body && typeof(res.body.idUser) === 'number' )
                    .toBe( true );
                expect( 'token'  in res.body && typeof(res.body.token)  === 'string' )
                    .toBe( true );

                admin_idUser = res.body.idUser;
                admin_token  = res.body.token;
            } );
    } );

    it( 'getProfileByUserId', () =>
    {
        return req( app.getHttpServer() )
            .get( `/api/profiles/user/${admin_idUser}` )
            .set('Authorization', `Bearer ${admin_token}`)
            .expect( 200 )
            .expect( (res: req.Response) =>
            {
                expect( res.body )
                    .toBeInstanceOf( GetProfileDto );

                admin_profile = res.body;
            } );
    } );

    it( 'updateAccount', () =>
    {
        const accountDto: AccountDto = {
            idUser: admin_idUser,
            profileName: 'name',
            email: 'new.mail@mail.ru'
        }

        return req( app.getHttpServer() )
            .put( '/api/profiles/' )
            .set('Authorization', `Bearer ${admin_token}`)
            .send(accountDto)
            .expect( 200 )
            .expect( (res: req.Response) =>
            {
                expect( res.body )
                    .toBeInstanceOf( AccountDto );
            } );
    } );

    it( 'deleteAccountByUserId', () =>
    {
        return req( app.getHttpServer() )
            .delete( `/api/profiles/${admin_idUser}` )
            .set('Authorization', `Bearer ${admin_token}`)
            .expect( 200 )
            .expect( (res: req.Response) =>
            {
                expect( res.body )
                    .toEqual( 1 );
            } );
    } );
} );
