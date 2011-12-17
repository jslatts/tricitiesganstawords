
// Client to server connector
// ==========================

;(function() {

  var root = this
    , socket = io.connect()
    , hud
    , usedWords
  
  root.attackWords = {}
  root.usedWords = {}
  root.playerId = null

  // Socket listeners
  // ----------------

  console.log('socket', socket.socket)

  $(function() {

    usedWords = $('#used-words')
    hud = $('#hud')

    function handleUsed(str, id) {
      root.usedWords[str] = id
      usedWords.prepend('<li>'+str+'</li>')
    }

    socket.on('connect', function() {
      root.playerId = socket.socket.sessionid


      socket.on('attack', function(str, id) {
        console.log('server attack')

        handleUsed(str, id)
        root.exports.incomingWord(str, (id === root.playerId))
      })

      socket.on('block', function(str, id) {
        console.log('server block')
        
        root.exports.destroyWord(str, (id === root.playerId))
      })

      // UI
      // --

      $(document).bind('keypress', function(e) {
        if (e.keyCode === 13) hud.fadeOut()
      })
    })

    // Blocking
    // --------


    // Attacking
    // ---------

    function attack(str, fn) {
      console.log('attack', str)
      socket.emit('attack', str, function(err) {
        console.log('return: ', err)
        if (err) {
          console.log('error', hud)
          hud
            .html(err)
            .fadeIn()
        }
        fn && fn(err)
      })
    }

    // Exports
    // -------

    root.attack = attack

    // Testing
      
      
  })

})()
