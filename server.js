var express = require('express')
  , socket = require('socket.io')

var app = express.createServer();

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
  var addr = app.address();
  console.log('   app listening on http://' + addr.address + ':' + addr.port);
});

var io = socket.listen(app)

io.sockets.on('connection', function (socket) {
  socket.on('attack', function (data, fn) {
    socket.broadcast.emit('attack', data)
    fn(true)
  });
});
