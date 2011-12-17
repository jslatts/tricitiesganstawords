var express = require('express')
  , socket = require('socket.io')
  , dictionary = require('./dictionary')

var app = express.createServer();

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
  var addr = app.address();
  console.log('   app listening on http://' + addr.address + ':' + addr.port);
});

var io = socket.listen(app)

var players = {},
    playedWords = {}

io.sockets.on('connection', function (socket) {

  players[socket.id] = {
    words: {}
  }

  socket.on('attack', function (word, fn) {
    word = word.toUpperCase()
    var id = socket.id;
    if (dictionary.hasOwnProperty(word) && !playedWords.hasOwnProperty(word)) {
      players[id].words[word] = true;
      playedWords[word] = true;
      io.sockets.emit('attack', {word: word, id: id})
      fn(null)
    } else if (playedWords[word]) {
      fn('Word already played')
    } else {
      fn('Not a valid word')
    }
  });

  socket.on('destroy', function(word, fn) {
    var id = socket.id;
    if (players[id].words.hasOwnProperty(word)) {
      delete players[id].words[word];
      io.sockets.emit('destroy', {word: word, id: id})
      fn(null)
    } else {
      fn('Word does not exist in players list')
    }
  })
});
