
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

      root.usedWords[str] = id
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

  function attack(str, fn) {
    socket.emit('attack', str, function(err) {
      if (err) {
        console.log('Attack Error: ', err)
      }
      fn && fn(err)
    })
  }

  function destroy(str, fn) {
    socket.emit('destroy', str, function(err) {
      if (err) {
        console.log('Destroy Error: ', err)
      }
      fn && fn(err)
    })
  }

  // Exports
  // -------

  root.attack = attack
  root.destroy = destroy

  // Testing
  $(function() {
    
    
  })

})()
