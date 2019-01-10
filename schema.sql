
 \connect soundcloud;
 CREATE SCHEMA IF NOT EXISTS testSong AUTHORIZATION user1;
    CREATE TABLE songs (
        id serial,
        album text, 
        artist text, 
        duration integer,
        released date,
        title text,
        wave text,
        image text,
        song_url text
    );