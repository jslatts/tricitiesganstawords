
// Client to server connector
// ==========================

;(function() {

  var root = this
    , socket = io.connect('http://localhost/')
  
  root.attackWords = {}
  root.usedWords = {}
  root.playerId = null

  // Socket listeners
  // ----------------

  console.log('socket', socket.socket)

  socket.on('connect', function() {
    root.playerId = socket.socket.sessionid


    socket.on('attack', function(str, id) {
      console.log('server attack')

      root.exports.incomingWord(str, (id === root.playerId))
    })

    socket.on('block', function(str, id) {
      console.log('server block')
      
      root.exports.destroyWord(str, (id === root.playerId))
    })
  })

  // Blocking
  // --------


  // Attacking
  // ---------

  function attack(e) {
    
  }

  // Exports
  // -------

  root.attack = attack

  // Testing
  $(function() {
    
    
  })

})()
