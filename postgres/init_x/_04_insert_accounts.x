\connect DB_users

INSERT INTO users (email, password, "idRole", "createdAt", "updatedAt") VALUES
('mail.1@mail.io', '$2a$05$PH2a8J/SfyCatxdT3/iCgO4ujboFvmR0uhwrNA4IM.utqoXL7JlFi', 2, Now(), Now()),
('mail.2@mail.io', '$2a$05$PH2a8J/SfyCatxdT3/iCgO4ujboFvmR0uhwrNA4IM.utqoXL7JlFi', 2, Now(), Now()),
('mail.3@mail.io', '$2a$05$PH2a8J/SfyCatxdT3/iCgO4ujboFvmR0uhwrNA4IM.utqoXL7JlFi', 2, Now(), Now());

-- -- -- -- --

\connect DB_profiles

INSERT INTO profiles ("profileName", "idUser", "createdAt", "updatedAt") VALUES
('User 1', 2, Now(), Now()),
('User 2', 3, Now(), Now()),
('User 3', 4, Now(), Now());
