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
    playedWords = {},
    losers = []

var count = 0;
var playerId = 0;

var gameStarted = false;

io.sockets.on('connection', function (socket) {

  playerId += 1;
  count += 1;

  players[socket.id] = {
    words: {},
    name: 'Player' + playerId
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
          playedWords[word] = true;
          io.sockets.emit('attack', word, id)
          Object.keys(players).forEach(function(_id) {
            if (id !== _id) {
              players[_id].words[word] = true;
            }
          })
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
    count -= 1;
    if (count <= 1) {
      io.sockets.emit('gameOver')
      gameStarted = false;
    }
  })
});

setInterval(function() {
  if (Object.keys(players).length >= 2 && !gameStarted) {
    io.sockets.emit('start', true);
    gameStarted = true;
  }

  Object.keys(players).forEach(function(_id) {
    if (Object.keys(players[_id].words).length >= 11) {
      losers.push(_id);
      io.sockets.emit('lose', _id)
    }
  })

  if ((losers.length >= 1) && ((Object.keys(players).length - losers.length) === 1)) {
    Object.keys(players).forEach(function(_id) {
      if (losers.indexOf(_id) == -1) {
        io.sockets.emit('win', _id)
        Object.keys(players).forEach(function(_id) {
          players[_id].words = {}
        })
        playedWords = {}
        losers = []
        gameStarted = false;
      }
    })
  }
}, 5*1000)
