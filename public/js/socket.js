(function() {
  var socket = io.connect(),
      playerId = null;

  socket.on('connect', function() {
    socket.emit('subscribe', function(id) {
      playerId = id;
    })
  })

  socket.on('attack', function(err, obj) {
    var word = obj.word,
        isMe = obj.id === playerId ? true : false;

    exports.incommingWord(word, isMe)
  })


}())
