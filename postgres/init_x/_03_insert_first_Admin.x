\connect DB_users

INSERT INTO roles ( name, description, "createdAt", "updatedAt" ) VALUES
( 'ADMIN', 'администратор', Now(), Now() ),
( 'USER', 'обычный пользователь', Now(), Now() );

INSERT INTO users(email, password, "idRole", "createdAt", "updatedAt") VALUES
('mail@mail.io', '$2a$05$PH2a8J/SfyCatxdT3/iCgO4ujboFvmR0uhwrNA4IM.utqoXL7JlFi', 1, Now(), Now());

-- -- -- -- --

\connect DB_profiles

INSERT INTO profiles ("profileName", "idUser", "createdAt", "updatedAt") VALUES
('Admin', 1, Now(), Now());
