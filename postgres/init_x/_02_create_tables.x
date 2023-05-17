\connect DB_users

CREATE TABLE roles
(
    id serial NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name_key UNIQUE (name)
);

CREATE TABLE users
(
    id serial NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "idRole" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT "users_idRole_fkey" FOREIGN KEY ("idRole")
        REFERENCES public.roles (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- -- -- -- --

\connect DB_profiles

CREATE TABLE profiles
(
    id serial NOT NULL,
    "profileName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "imageName" character varying(255) COLLATE pg_catalog."default",
    "idUser" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT "profiles_idUser_key" UNIQUE ("idUser"),
    CONSTRAINT "profiles_imageName_key" UNIQUE ("imageName")
);

CREATE TABLE IF NOT EXISTS public.comments
(
    id serial NOT NULL,
    "idFilm" integer NOT NULL,
    "idUser" integer NOT NULL,
    "idProfile" integer,
    title character varying(255) COLLATE pg_catalog."default",
    text character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "prevId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone,
    CONSTRAINT comments_pkey PRIMARY KEY (id),
    CONSTRAINT "comments_idProfile_fkey" FOREIGN KEY ("idProfile")
        REFERENCES public.profiles (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE "ratingUsers"
(
    id serial NOT NULL,
    rating integer,
    "idFilm" integer,
    "idUser" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "ratingUsers_pkey" PRIMARY KEY (id)
);

-- -- -- -- --

\connect DB_films

CREATE TABLE countries
(
    id serial NOT NULL,
    "nameRU" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "nameEN" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT countries_pkey PRIMARY KEY (id),
    CONSTRAINT "countries_nameEN_key" UNIQUE ("nameEN"),
    CONSTRAINT "countries_nameRU_key" UNIQUE ("nameRU")
);

CREATE TABLE genres
(
    id serial NOT NULL,
    "nameRU" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "nameEN" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT genres_pkey PRIMARY KEY (id)
);

CREATE TABLE films
(
    id serial NOT NULL,
    "nameRU" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "nameEN" character varying(255) COLLATE pg_catalog."default",
    year integer NOT NULL,
    "ageRating" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    duration integer NOT NULL,
    "imageName" character varying(255) COLLATE pg_catalog."default",
    rating double precision,
    "countRating" integer,
    "idCountry" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT films_pkey PRIMARY KEY (id),
    CONSTRAINT "films_imageName_key" UNIQUE ("imageName"),
    CONSTRAINT "films_idCountry_fkey" FOREIGN KEY ("idCountry")
        REFERENCES public.countries (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE "filmGenres"
(
    id serial NOT NULL,
    "idFilm" integer NOT NULL,
    "idGenre" integer NOT NULL,
    CONSTRAINT "filmGenres_pkey" PRIMARY KEY (id),
    CONSTRAINT "filmGenres_idFilm_idGenre_key" UNIQUE ("idFilm", "idGenre"),
    CONSTRAINT "filmGenres_idFilm_fkey" FOREIGN KEY ("idFilm")
        REFERENCES public.films (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "filmGenres_idGenre_fkey" FOREIGN KEY ("idGenre")
        REFERENCES public.genres (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- -- -- -- --

\connect DB_film_info

CREATE TABLE "filmInfo"
(
    id serial NOT NULL,
    text character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "trailerLink" character varying(255) COLLATE pg_catalog."default",
    "idFilm" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "filmInfo_pkey" PRIMARY KEY (id),
    CONSTRAINT "filmInfo_idFilm_key" UNIQUE ("idFilm")
);

-- -- -- -- --

\connect DB_members

CREATE TABLE professions
(
    id serial NOT NULL,
    "nameRU" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "nameEN" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT professions_pkey PRIMARY KEY (id),
    CONSTRAINT "professions_nameEN_key" UNIQUE ("nameEN"),
    CONSTRAINT "professions_nameRU_key" UNIQUE ("nameRU")
);

CREATE TABLE members
(
    id serial NOT NULL,
    "nameRU" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "nameEN" character varying(255) COLLATE pg_catalog."default",
    text character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "imageName" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT members_pkey PRIMARY KEY (id),
    CONSTRAINT "members_imageName_key" UNIQUE ("imageName")
);

CREATE TABLE "filmMembers"
(
    id serial NOT NULL,
    "idFilm" integer NOT NULL,
    "idMember" integer NOT NULL,
    "idProfession" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "filmMembers_pkey" PRIMARY KEY (id),
    CONSTRAINT "filmMembers_idMember_fkey" FOREIGN KEY ("idMember")
        REFERENCES public.members (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "filmMembers_idProfession_fkey" FOREIGN KEY ("idProfession")
        REFERENCES public.professions (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);