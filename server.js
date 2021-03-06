// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));

/************
 * DATABASE *
 ************/

let db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
  db.Album.find({}, function(error, albums) {
     if (error) {
      res.send("GAHHHHHH");
     }
    res.json(albums);
  });
});

app.post('/api/albums', function album_create(req, res) {
  req.body.genres = req.body.genres.split(',');
  db.Album.create({
    name: req.body.name, 
    artistName: req.body.artistName, 
    releaseDate: req.body.releaseDate, 
    genres: req.body.genres
  }, function(error, album) {
    if (error) {
      res.send("NAHHHT VARKING");
    }
    res.send(album);
  });
});

app.post('/api/albums/:album_id/songs', function album_add_song(req, res) {
  db.Album.findOne({_id: req.params.album_id}, function(err, album) {
    if (err) { console.log('error', err); }
    let song = new db.Song(req.body);
    album.songs.push(song);
    album.save(function(err, savedAlbum) {
      if (err) { console.log('error', err); }
      console.log('album with new song saved:', savedAlbum);
      res.json(song);
    });
  });
});

app.get('/api/albums/:id', function album_show(req, res) {
  db.Album.findOne({_id: req.params.id}, function(err, album) {
    res.json(album);
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
