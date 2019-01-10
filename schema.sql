
 \connect soundcloud;
 CREATE SCHEMA IF NOT EXISTS testSong AUTHORIZATION user1;
    CREATE TABLE songs (
        album text, 
        artist text, 
        duration integer,
        id integer,
        released date,
        title text,
        wave text,
        image text,
        song_url text
    );