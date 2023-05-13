
import { NestFactory           } from '@nestjs/core';
import { AppModule             } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
    const PORT          = process.env.PORT;
    const URL_USERS     = process.env.URL_USERS     || "http://localhost:12121";
    const URL_PROFILES  = process.env.URL_PROFILES  || "http://localhost:12122";
    const URL_FILMS     = process.env.URL_FILMS     || "http://localhost:12123";
    const URL_FILM_INFO = process.env.URL_FILM_INFO || "http://localhost:12124";
    const URL_MEMBERS   = process.env.URL_MEMBERS   || "http://localhost:12125";

    const app = await NestFactory.create(AppModule);
    app.enableCors();

    // WAYs
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

    await app.listen(PORT, () =>
        console.log(`\n = > GATE WAY\n = > started\n = > port : ${PORT}\n`)
    );
}

bootstrap();
