
const pgp = require('pg-promise')({});

const playlist = require('./seed.js');

const databaseConfig = {
  "host": "localhost",
  "port": 5432,
  "database": "soundcloud",
  "user": "andrei",
  "password": "privet",
};

// console.log(playlist);

const db = pgp(databaseConfig);

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function getNextData(t, pageIndex) {
  let data = null;
  if (pageIndex < 1000) {
    data = [];
    for (let i = 0; i < 10000; i++) {
      const idx = pageIndex * 10000 + i;
      console.log(idx);
      data.push({
        id: idx,
        album: playlist.songArray[idx].album,
        artist: playlist.songArray[idx].artist,
        duration: playlist.songArray[idx].duration,
        released: playlist.songArray[idx].released,
        title: playlist.songArray[idx].title,
        image: playlist.songArray[idx].image,
        song_url: playlist.songArray[idx].song_url,
      });
    }
  }
  return Promise.resolve(data);
}

const cs = new pgp.helpers.ColumnSet([
  'id',
  'album',
  'artist', 
  'duration',
  'released',
  'title',
  'image',
  'song_url',
], {table: 'songs'});

db.connect()
  .then(obj => {
    console.log('connected to database');
      obj.done(); // success, release the connection;
  })
  .catch(error => {
      console.log('ERROR:', error.message || error);
});

db.tx('massive-insert', t => {
  return t.sequence(index => {
    // if (index === 0) {
    //   console.log(index)
    // } 
    return getNextData(t, index)
    .then(data => {
      if (data) {
          const insert = pgp.helpers.insert(data, cs);
          return t.none(insert);
      }
    });
  });
})
.then(data => {
  // COMMIT has been executed
  console.log('Total batches:', data.total, ', Duration:', millisToMinutesAndSeconds(data.duration));
})
.catch(error => {
  // ROLLBACK has been executed
  console.log(error);
});


