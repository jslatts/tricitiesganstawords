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

io.sockets.on('connection', function (socket) {

  socket.on('subscribe', function(fn) {
    console.log('subscribe')
    fn(socket.id)
  })

  socket.on('attack', function (word, id, fn) {
    if (dictionary[data.toUpperCase()]) {
      socket.broadcast.emit('attack', {word: word, id: id})
      fn(null)
    } else {
      fn(true)
    }
  });
});
