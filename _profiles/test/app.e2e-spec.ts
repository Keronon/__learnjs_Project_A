
import * as req from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GetProfileDto    } from '../src/profiles/dto/get-profile.dto';
import { AccountDto       } from '../src/profiles/dto/account.dto';
import { RegistrationDto  } from '../src/profiles/dto/registration.dto';
import { ConfigModule     } from '@nestjs/config';
import { SequelizeModule  } from '@nestjs/sequelize';
import { Profile          } from '../src/profiles/profiles.struct';
import { Comment          } from '../src/comments/comments.struct';
import { JwtGlobalModule  } from '../src/jwt.module';
import { ProfilesModule   } from '../src/profiles/profiles.module';
import { CommentsModule   } from '../src/comments/comments.module';

describe( '_profiles', () =>
{
    let app: INestApplication;
    let admin_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsLTFAbWFpbC5ydSIsImlkIjoxLCJyb2xlIjp7ImlkIjoxLCJuYW1lIjoiQURNSU4iLCJkZXNjcmlwdGlvbiI6ItCw0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiY3JlYXRlZEF0IjoiMjAyMy0wNC0yMFQxNDozMTozMS43NzVaIiwidXBkYXRlZEF0IjoiMjAyMy0wNC0yMFQxNDozMTozMS43NzVaIn0sImlhdCI6MTY4MzMwNzYxMSwiZXhwIjoxNjgzMzk0MDExfQ.2Xtp9u-fy4LqUjHS2a6ZYGFSJKngxX9-gLOY2hWsmJI';
    let ids: number[] = [];

    beforeAll( async () =>
    {
        const moduleRef: TestingModule = await Test.createTestingModule( {
            imports: [
                ConfigModule.forRoot({ envFilePath: '.env' }),

                SequelizeModule.forRoot({
                    dialect: 'postgres',
                    host: process.env.PG_HOST || 'pg',
                    port: Number(process.env.PG_PORT) || 5432,
                    username: process.env.PG_USER || 'postgres',
                    password: process.env.PG_PASS || 'root',
                    database: process.env.PG_DB || 'DB_profiles',
                    models: [Profile, Comment],
                    autoLoadModels: true,
                    logging: false
                }),

                JwtGlobalModule,
                ProfilesModule,
                CommentsModule,
            ],
        } ).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        await new Promise(resolve => setTimeout(resolve, 300));
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
        }

        return req( app.getHttpServer() )
            .post( '/api/profiles/reg/admin' )
            .set('Authorization', `Bearer ${admin_token}`)
            .send(registrationDto)
            .expect( 201 )
            .expect( (res: req.Response) =>
            {
                expect( 'idUser' in res.body && typeof(res.body.idUser) === 'number' )
                    .toBe( true );
                expect( 'token'  in res.body && typeof(res.body.token)  === 'string' )
                    .toBe( true );

                ids.push(res.body.idUser);
                admin_token = res.body.token;
            } );
    } );

    it( 'getProfileByUserId', () =>
    {
        return req( app.getHttpServer() )
            .get( `/api/profiles/user/${ids[1]}` )
            .set('Authorization', `Bearer ${admin_token}`)
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
        }

        return req( app.getHttpServer() )
            .put( '/api/profiles/' )
            .set('Authorization', `Bearer ${admin_token}`)
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
            .set('Authorization', `Bearer ${admin_token}`)
            .expect( 200 )
            .expect( (res: req.Response) =>
            {
                expect( res.text )
                    .toEqual( '1' );
            } );
    } );

    it( 'deleteAccountByUserId : admin', () =>
    {
        return req( app.getHttpServer() )
            .delete( `/api/profiles/${ids[1]}` )
            .set('Authorization', `Bearer ${admin_token}`)
            .expect( 200 )
            .expect( (res: req.Response) =>
            {
                expect( res.text )
                    .toEqual( '1' );
            } );
    } );
} );
