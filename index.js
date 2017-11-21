// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var mongoose = require('mongoose');

var app = express();

// Express
app.use(express.static('public'));
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());

// MondoDB
mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/hiphop_artists', {
  useMongoClient: true,
});

promise.then(function(db) {
  console.log('MONGO CONNECTED');
}).catch(function(err) {
  console.log('CONNECTION ERROR', err);
});

// APPLICATION

var artists = [];

// Schema set up
var Schema = mongoose.Schema;

var favArtistSchema = new Schema({
  name: String,
  img: String,
  favSong: String,
  subGenre: String,
  age: Number,
  noAlbums: Number,
  noCollabs: Number,
  noAlterEgos: Number,
  noRecordsSold: Number
});

var HipHopArtist = mongoose.model('Artist', favArtistSchema);

// App functions

app.get('/artists', function(req, res) {
  HipHopArtist.find({}).exec(function(err, artists) {
    console.log('Found them thugz!');
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(artists);
  });
});

app.get('/artists/:id?', function(req, res) {
  var artistId = req.params.id;
  var query = artistId ? {id: artistId} : {};
  HipHopArtist.find(query).exec(function(err, artists) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(artists);
  });
});

app.post('/artists', function(req, res) {
  var newArtists = new HipHopArtist(req.body);
  newArtists.save(function(err, artists) {
    if(err) {
      return res.sendStatus(404);
    }
    console.log('Thug added!');
    return res.status(201).json(artists);
  });
});

app.put('/artists/:name', function (req,res) {
  var artistsToBeUpdated = req.params.name;
  console.log('artistsToBeUpdated', artistsToBeUpdated);
  var updates = req.body;
  console.log('updates', updates);
  HipHopArtist.findOneAndUpdate({
    name: artistsToBeUpdated
  }, updates, function(err, req, artists, result) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log('artists', artists);
    console.log('result', result);
    return res.status(202).send('DONE');
  });
});

app.delete('/artists/:id', function(req, res) {
  var artistToDelete = req.params.id;
  HipHopArtist.remove({
    id: artistToDelete
  }, function(err, friends){
    if (err) {
      return res.status(500),send(err);
    }
    console.log('Thug killed', artists);
    return res.status(202).send('DONE');
  });
});

// Listen
app.listen(3333, function(){
  console.log('API running on port 3333');
});
