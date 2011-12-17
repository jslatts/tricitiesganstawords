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

  io.sockets.emit('players', players)

  socket.emit('used', playedWords)

  socket.on('attack', function (word, fn) {
    word = word.toUpperCase()
    var id = socket.id;
    if (dictionary.hasOwnProperty(word)) {
      if (players[id].words.hasOwnProperty(word)) {
        delete players[id].words[word];
        io.sockets.emit('block', word, id)
        fn(null)
      } else {
        if (!playedWords.hasOwnProperty(word)) {
          Object.keys(players).forEach(function(_id) {
            if (id !== _id) players[_id].words[word] = true;
          })
          playedWords[word] = true;
          io.sockets.emit('attack', word, id)
          fn(null)
        } else {
          fn('Word has been played')
        }
      }
    } else {
      fn('Not a valid word')
    }
  });

  socket.on('disconnect', function() {
    delete players[socket.id]
    io.sockets.emit('players', players)
  })
});
