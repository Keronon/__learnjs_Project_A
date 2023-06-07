
import * as req from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication    } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

// ! DB structs

class Login
{
    idUser: number;
    role  : Role  ;
    token : string;
}

class User
{
    id      : number;
    email   : string;
    password: string;
    idRole  : number;
}

class Role
{
    id         : number;
    name       : string;
    description: string;
}

class Profile
{
    id         : number;
    profileName: string;
    imageName  : string;
    idUser     : number;
}

class Comment
{
    id       : number;
    idFilm   : number;
    idUser   : number;
    idProfile: number;
    title    : string;
    text     : string;
    prevId   : number;
}

class RatingUser
{
    id    : number;
    rating: number;
    idFilm: number;
    idUser: number;
}

class Member
{
    id       : number;
    nameRU   : string;
    nameEN   : string;
    text     : string;
    imageName: string;
}

class Profession
{
    id    : number;
    nameRU: string;
    nameEN: string;
}

class FilmMember
{
    id          : number;
    idFilm      : number;
    idMember    : number;
    idProfession: number;
}

class Film
{
    id         : number;
    nameRU     : string;
    nameEN     : string;
    year       : number;
    ageRating  : string;
    duration   : number;
    imageName  : string;
    rating     : number;
    countRating: number;
    idCountry  : number;
}

class Country
{
    id    : number;
    nameRU: string;
    nameEN: string;
}

class Genre
{
    id    : number;
    nameRU: string;
    nameEN: string;
}

class FilmGenre
{
    id     : number;
    idFilm : number;
    idGenre: number;
}

class FilmInfo
{
    id         : number;
    text       : string;
    trailerLink: string;
    idFilm     : number;
}

// ! DTO

class AccountDto
{
    idUser     : number;
    profileName: string;
    email      : string;
}

class GetPrimaryCommentDto
{
    id           : number;
    idFilm       : number;
    idUser       : number;
    idProfile    : number;
    title        : string;
    text         : string;
    prevId       : number;
    childrenCount: number;
}

class GetMemberFilmDto
{
    film: Film;
    profession: Profession;
}

class MembersFilterDto
{
    idMember    : number;
    idProfession: number;
}

enum TypesSorting {
    rating      = 'rating',
    countRating = 'countRating',
    year        = 'year',
    alphabetRU  = 'alphabetRU',
    alphabetEN  = 'alphabetEN',
}

// ! Tests

// Общие тесты проекта через Врата
describe( 'GATE', () =>
{
    let app: INestApplication;
    let admin_token: string;

    // Инициализация сервиса Врат и проксирования через него
    beforeAll( async () =>
    {
        const URL_USERS     = "http://localhost:12121";
        const URL_PROFILES  = "http://localhost:12122";
        const URL_FILMS     = "http://localhost:12123";
        const URL_FILM_INFO = "http://localhost:12124";
        const URL_MEMBERS   = "http://localhost:12125";
        const moduleRef: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        app.use('/api/users'        , createProxyMiddleware({ changeOrigin: true, target: URL_USERS    , }));
        app.use('/api/profiles'     , createProxyMiddleware({ changeOrigin: true, target: URL_PROFILES , }));
        app.use('/api/comments'     , createProxyMiddleware({ changeOrigin: true, target: URL_PROFILES , }));
        app.use('/api/rating-users' , createProxyMiddleware({ changeOrigin: true, target: URL_PROFILES , }));
        app.use('/api/films'        , createProxyMiddleware({ changeOrigin: true, target: URL_FILMS    , }));
        app.use('/api/countries'    , createProxyMiddleware({ changeOrigin: true, target: URL_FILMS    , }));
        app.use('/api/genres'       , createProxyMiddleware({ changeOrigin: true, target: URL_FILMS    , }));
        app.use('/api/film-info'    , createProxyMiddleware({ changeOrigin: true, target: URL_FILM_INFO, }));
        app.use('/api/members'      , createProxyMiddleware({ changeOrigin: true, target: URL_MEMBERS  , }));
        app.use('/api/professions'  , createProxyMiddleware({ changeOrigin: true, target: URL_MEMBERS  , }));
        app.use('/api/film-members' , createProxyMiddleware({ changeOrigin: true, target: URL_MEMBERS  , }));
    } );

    // ? Сервис users

    // эндпоинты аутентификации
    describe( 'auth (e2e)', () =>
    {
        // запрос на вход
        it( 'login', () =>
        {
            // данные входа
            const authDto = {
                email: 'email@mail.io',
                password: 'password',
            };

            // запрос
            return req( app.getHttpServer() )
                .post( '/api/users/login' )
                .send(authDto)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Login) );

                    admin_token = res.body.token;
                    console.log('\n\n = = = A D M I N _ T O K E N = = = \n\n');
                    console.log(admin_token);
                } );
        } );
    });

    // эндпоинты пользователей
    describe( 'users (e2e)', () =>
    {
        // запрос получения всех пользователей
        it( 'getAllUsers', () =>
        {
            return req( app.getHttpServer() )
                .get( '/api/users' )
                .set('Authorization', `Bearer ${admin_token}`)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    res.body.every((v) => expect(v).toBe( expect.any(User) ));
                } );
        } );

        // запрос получения пользователей по id
        it( 'getUserById', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/users/${1}` )
                .set('Authorization', `Bearer ${admin_token}`)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(User) );
                } );
        } );
    });

    // ? Сервис profiles

    // эндпоинты профилей
    describe( 'profiles (e2e)', () =>
    {
        let ids: number[] = [];

        // запрос на регистрацию пользователя
        it( 'regUser', () =>
        {
            // данные пользователя
            const registrationDto = {
                profileName: 'name-1',
                email: 'mail-1@mail.io',
                password: 'password',
            };

            // запрос
            return req( app.getHttpServer() )
                .post( '/api/profiles/reg/user' )
                .send(registrationDto)
                .expect( 201 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Login) );
                    ids.push(res.body.idUser);
                } );
        } );

        // запрос на регистрацию администратора
        it( 'regAdmin', () =>
        {
            // данные пользователя
            const registrationDto = {
                profileName: 'name-2',
                email: 'mail-2@mail.io',
                password: 'password',
            };

            // запрос
            return req( app.getHttpServer() )
                .post( '/api/profiles/reg/admin' )
                .set('Authorization', admin_token)
                .send(registrationDto)
                .expect( 201 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Login) );
                    ids.push(res.body.idUser);
                } );
        } );

        // запрос на получения профиля по id пользователя
        it( 'getProfileByUserId', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/profiles/user/${ids[1]}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Profile) );
                } );
        } );

        // запрос на изменение данных аккаунта
        it( 'updateAccount', () =>
        {
            // новые данные аккаунта
            const accountDto = {
                idUser: ids[1],
                profileName: 'name',
                email: 'new.mail@mail.ru'
            };

            // запрос
            return req( app.getHttpServer() )
                .put( '/api/profiles/' )
                .set('Authorization', admin_token)
                .send(accountDto)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(AccountDto));
                } );
        } );

        // удаление пользователя ( первого созданного )
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

        // удаление пользователя ( второго созданного )
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

    // эндпоинты комментариев
    describe( 'comments (e2e)', () =>
    {
        let id: number;

        // запрос на создание комментария
        it( 'createComment', () =>
        {
            // данные комментария
            const createCommentDto = {
                idFilm: 1,
                idUser: 1,
                title : null,
                text: 'ерунда',
                prevId: null
            };

            // запрос
            return req( app.getHttpServer() )
                .post( '/api/comments' )
                .set('Authorization', admin_token)
                .send(createCommentDto)
                .expect( 201 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Comment) );
                    id = res.body.id;
                } );
        } );

        // запрос на получение всех корневых комментариев по id фильма
        it( 'getCommentsByFilm', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/comments/film/${1}` )
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    res.body.every((v) => expect(v).toBe( expect.any(GetPrimaryCommentDto) ));
                } );
        } );

        // запрос на получение древа комментариев по id корневого комментария
        it( 'getCommentsByComment', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/comments/comment/${id}` )
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            children: expect.any(Array<Comment>)
                        })
                    );
                } );
        } );

        // запрос на удаление комантария по его id
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

    // эндпоинты пользовательских оценок фильмов
    describe( 'rating-users (e2e)', () =>
    {
        // запрос на получение оценки по id фильма и id пользователя
        it( 'getRatingUserByFilmIdAndUserId', () =>
        {
            return req( app.getHttpServer() )
                .post( `/api/rating-users/film/${1}/user/${1}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    res.body.every((v) => expect(v).toBe( expect.any(RatingUser) ));
                } );
        } );

        // запрос на установку оценки фильма пользователем
        it( 'setRatingUser', () =>
        {
            // данные оценки
            const setRatingUserDto = {
                rating: 10,
                idFilm: 1,
                idUser: 1
            };

            // запрос
            return req( app.getHttpServer() )
                .post( '/api/rating-users' )
                .set('Authorization', admin_token)
                .send(setRatingUserDto)
                .expect( 201 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(RatingUser) );
                } );
        } );
    });

    // ? Сервис members

    // эндпоинты людей
    describe( 'members (e2e)', () =>
    {
        let id: number;

        // запрос на добавление человека
        it( 'createMember', () =>
        {
            // данные пользователя
            const сreateMemberDto = {
                nameRU: 'имя',
                nameEN: 'name',
                text  : 'описание'
            };

            // запрос
            return req( app.getHttpServer() )
                .post( '/api/members' )
                .set('Authorization', admin_token)
                .send(сreateMemberDto)
                .expect( 201 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Member) );
                    id = res.body.id;
                } );
        } );

        // запрос на получения человека по id
        it( 'getMemberById', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/members/${1}` )
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Member) );
                } );
        } );

        // запрос на получения всех людей
        it( 'getAllMembers', () =>
        {
            return req( app.getHttpServer() )
                .get( '/api/members' )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    res.body.every((v) => expect(v).toBe( expect.any(Member) ));
                } );
        } );

        // удаление созданного человека
        it( 'deleteMember', () =>
        {
            return req( app.getHttpServer() )
                .delete( `/api/members/${id}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect( res.text ).toEqual( '1' );
                } );
        } );
    } );

    // эндпоинты профессий

    // эндпоинты членов фильмов

    // ? Сервис films

    // эндпоинты фильмов
    describe( 'films (e2e)', () =>
    {
        let id: number;

        // запрос на добавление фильма
        it( 'createFilm', () =>
        {
            // данные пользователя
            const сreateFilmDto = {
                nameRU     : 'название',
                nameEN     : 'name',
                year       : 2000,
                ageRating  : '16+',
                duration   : 120,
                text       : 'описание',
                trailerLink: 'http://link...',
                idCountry  : 1,
                arrIdGenres: [1, 2]
            };

            // запрос
            return req( app.getHttpServer() )
                .post( '/api/films' )
                .set('Authorization', admin_token)
                .send(сreateFilmDto)
                .expect( 201 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Film) );
                    id = res.body.id;
                } );
        } );

        // запрос на получения фильма по id
        it( 'getFilmById', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/films/${1}` )
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Film) );
                } );
        } );

        // запрос на получения всех фильмов на указанной странице
        it( 'getAllFilms', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/films/part/${1}` )
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    res.body.every((v) => expect(v).toBe( expect.any(Film) ));
                } );
        } );

        // запрос на получения всех фильмов, в которых участвовал указанный человек
        it( 'getMemberFilms', () =>
        {
            return req( app.getHttpServer() )
                .get( `/api/films/member/${1}` )
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    res.body.every((v) => expect(v).toBe( expect.any(GetMemberFilmDto) ));
                } );
        } );

        // запрос на получения всех фильмов с использованием фильтра
        it( 'getFilteredFilms', () =>
        {
            // данные сортировки
            const filmFiltersDto = {
                arrIdGenres        : [1, 2],
                arrIdCountries     : [1, 2],
                ratingStart        : 1,
                countRatingStart   : 1,
                yearStart          : 1,
                yearEnd            : 1,
                arrMembersFilterDto: [{idMember: 1, idProfession: 1} as MembersFilterDto],
                part               : 1,
                typeSorting        : TypesSorting.year
            }

            // запрос
            return req( app.getHttpServer() )
                .post( '/api/films/filter' )
                .send(filmFiltersDto)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    res.body.every((v) => expect(v).toBe( expect.any(Film) ));
                } );
        } );

        // запрос на изменение данных фильма
        it( 'updateFilm', () =>
        {
            // новые данные фильма
            const updateFilmDto = {
                id         : id,
                nameRU     : 'название',
                nameEN     : 'name',
                year       : 1,
                ageRating  : '18+',
                duration   : 1,
                idCountry  : 1,
                arrIdGenres: [1]
            };

            // запрос
            return req( app.getHttpServer() )
                .put( '/api/films' )
                .set('Authorization', admin_token)
                .send(updateFilmDto)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect(res.body).toBe( expect.any(Film));
                } );
        } );

        // удаление созданного фильма
        it( 'deleteFilmById', () =>
        {
            return req( app.getHttpServer() )
                .delete( `/api/films/${id}` )
                .set('Authorization', admin_token)
                .expect( 200 )
                .expect( (res: req.Response) =>
                {
                    expect( res.text ).toEqual( '1' );
                } );
        } );
    } );

    // эндпоинты стран

    // эндпоинты жанров

    // эндпоинты жанров фильмов

    // ? Сервис film-info

    // эндпоинты информации о фильмах
} );
