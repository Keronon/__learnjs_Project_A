
import * as req from 'supertest';
import { Test, TestingModule  } from '@nestjs/testing';
import { INestApplication     } from '@nestjs/common';
import { AppModule            } from '../src/app.module';
import { GetProfileDto        } from '../src/profiles/dto/get-profile.dto';
import { AccountDto           } from '../src/profiles/dto/account.dto';
import { RegistrationDto      } from '../src/profiles/dto/registration.dto';
import { CreateCommentDto     } from '../src/comments/dto/create-comment.dto';
import { GetPrimaryCommentDto } from '../src/comments/dto/get-primary-comment.dto';
import { Comment              } from '../src/comments/comments.struct';

describe( '_profiles', () =>
{
    let app: INestApplication;
    let admin_token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsLTFAbWFpbC5ydSIsImlkIjoxLCJyb2xlIjp7ImlkIjoxLCJuYW1lIjoiQURNSU4iLCJkZXNjcmlwdGlvbiI6ItCw0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiY3JlYXRlZEF0IjoiMjAyMy0wNC0yMFQxNDozMTozMS43NzVaIiwidXBkYXRlZEF0IjoiMjAyMy0wNC0yMFQxNDozMTozMS43NzVaIn0sImlhdCI6MTY4MzM4MTQ4NywiZXhwIjoxNjgzNDY3ODg3fQ.vKxV5XyNhy4t0wgAGaKgxcbVbM6tSqMtOHwsGXS1bx0';

    beforeAll( async () =>
    {
        const moduleRef: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        await app.init();

        await new Promise(resolve => setTimeout(resolve, 300));
    } );

    describe( 'profiles (e2e)', () =>
    {
        let ids: number[] = [];

        it( 'regUser', () =>
        {
            const registrationDto: RegistrationDto = {
                profileName: 'name1',
                email: 'mail.a@mail.ru',
                password: 'password',
            };

            return req( app.getHttpServer() )
                .post( '/api/profiles/reg/user' )
                .send(registrationDto)
                .expect( 201 )
                .expect( (res: req.Response) =>
                {
                    expect( 'idUser' in res.body && typeof(res.body.idUser) === 'number' )
                        .toBe( true );
                    expect( 'token'  in res.body && typeof(res.body.token)  === 'string' )
                        .toBe( true );

                    ids.push(res.body.idUser);
                } );
        } );

        it( 'regAdmin', () =>
        {
            const registrationDto: RegistrationDto = {
                profileName: 'name2',
                email: 'mail.b@mail.ru',
                password: 'password',
            };

            return req( app.getHttpServer() )
                .post( '/api/profiles/reg/admin' )
                .set('Authorization', admin_token)
                .send(registrationDto)
                .expect( 201 )
                .expect( (res: req.Response) =>
                {
                    expect( 'idUser' in res.body && typeof(res.body.idUser) === 'number' )
                        .toBe( true );
                    expect( 'token'  in res.body && typeof(res.body.token)  === 'string' )
                        .toBe( true );

                    ids.push(res.body.idUser);
                } );
        } );

        it( 'getProfileByUserId', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/profiles/user/${ids[1]}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    for (const key in new GetProfileDto)
                        expect(res.body[key]).toBeDefined();
                } );
        } );

        it( 'updateAccount', () =>
        {
            const accountDto: AccountDto = {
                idUser: ids[1],
                profileName: 'name',
                email: 'new.mail@mail.ru'
            };

            return req( app.getHttpServer() )
                .put( '/api/profiles/' )
                .set('Authorization', admin_token)
                .send(accountDto)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    for (const key in new AccountDto)
                        expect(res.body[key]).toBeDefined();
                } );
        } );

        it( 'deleteAccountByUserId : user', () =>
        {
            return req( app.getHttpServer() )
                .delete( `/api/profiles/${ids[0]}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect( res.text ).toEqual( '1' );
                } );
        } );

        it( 'deleteAccountByUserId : admin', () =>
        {
            return req( app.getHttpServer() )
                .delete( `/api/profiles/${ids[1]}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect( res.text ).toEqual( '1' );
                } );
        } );
    } );

    describe( 'comments (e2e)', () =>
    {
        let id: number;

        it( 'createComment', () =>
        {
            const createCommentDto: CreateCommentDto = {
                idFilm: 1,
                idUser: 1,
                text: 'ерунда',
                prevId: null,
                title: null
            };

            return req( app.getHttpServer() )
                .post( '/api/comments' )
                .set('Authorization', admin_token)
                .send(createCommentDto)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBeInstanceOf(Comment);

                    id = res.body.id;
                } );
        } );

        it( 'getCommentsByFilm', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/comments/film/${1}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(Array.isArray(res.body)).toBe(true);

                    res.body.every((v) => {
                        for (const key in new GetPrimaryCommentDto)
                            expect(res.body[key]).toBeDefined();
                    });
                } );
        } );

        it( 'getCommentsByComment', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/comments/comment/${id}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(Array.isArray(res.body)).toBe(true);
                } );
        } );

        it( 'deleteCommentById', () =>
        {
            return req( app.getHttpServer() )
                .delete( `/api/comments/${id}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect( res.text ).toEqual( '1' );
                } );
        } );
    });
} );
