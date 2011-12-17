
// Client to server connector
// ==========================

;(function() {

  var root = this
    , socket = io.connect()
    , hud
    , usedWords
    , playersList
    , modal
  
  root.attackWords = {}
  root.usedWords = {}
  root.playerId = null
  root.playerName = null
  root.playing = true
  root.players = null

  // Socket listeners
  // ----------------

  console.log('socket', socket.socket)

  $(function() {


    usedWords = $('#used-words')
    hud = $('#hud')
    playersList = $('#players')
    modal = $('#modal')

    function handleUsed(str, id) {
      root.usedWords[str] = id
      usedWords.prepend('<li>'+str+'</li>')
    }

    socket.on('connect', function() {
      root.playerId = socket.socket.sessionid

      socket.on('used', function(words) {
        if (!words) return
        Object.keys(words).forEach(function(str) {
          usedWords.prepend('<li>'+str.toUpperCase()+'</li>')
        })
      })

      socket.on('players', function(people) {
        if (!people) return
        root.players = people;
        playersList.empty()
        Object.keys(people).forEach(function(person) {
          playersList.append('<li id="p-'+person+'">'+people[person].name+'</li>')
        })
      })

      // Actions
      // -------

      socket.on('attack', function(str, id) {
        if (!root.playing) return
        str = str.toLowerCase().trim()
        handleUsed(str, id)
        root.exports.incomingWord(str, (id === root.playerId))
      })

      socket.on('block', function(str, id) {
        if (!root.playing) return
        str = str.toLowerCase().trim()
        root.exports.destroyWord(str, (id === root.playerId))
      })

      // Win conditions
      // --------------

      socket.on('lose', function(id) {
        console.log('lose', id)
        playersList.find('#p-'+id).addClass('lost')

        if (root.playing) {
          if (id === root.playerId) {
            youLost()
          }
        }
      })

      socket.on('win', function(id) {
        console.log('win', id)
        winGame(id)
      })

      socket.on('start', function() {
        console.log('start game')
        startGame()
      })

      socket.on('gameOver', function() {
        gameOver()
      })

      // UI
      // --

      $(window).bind('keypress', function(e) {
        if (e.keyCode === 13) hud.fadeOut()
      })
    })

    // Attacking
    // ---------

    function attack(str, fn) {
      str = str.toLowerCase().trim()
      socket.emit('attack', str, function(err) {
        if (err) {
          hud.html(err).fadeIn()
        }
        fn && fn(err)
      })
    }

    function youLost() {
      modal
        .fadeIn()
        .queue(function(n) { $(this).html('You Lost!'); n() })
        .delay(3000)
        .fadeOut()
      
      root.playing = false
    }

    function gameOver() {
      modal
        .fadeIn()
        .queue(function(n) { $(this).html('Game Over'); n() })
        .delay(1500)

      root.playing = false
    }

    function startGame() {
      usedWords.empty()
      exports.resetGame()

      modal
        .fadeIn()
        .queue(function(n) { $(this).html('Starting Game...'); n() })
        .delay(2000)
        .queue(function(n) { $(this).html('5'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('4'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('3'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('2'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('1'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('Start!'); n() })
        .fadeOut(function() {
          root.playing = true
        })
    }

    function winGame(id) {
      usedWords.empty()
      exports.resetGame()
      root.playing = false

      modal
        .fadeIn()
        .queue(function(n) { $(this).html('Game Over'); n() })
        .delay(1500)
        .queue(function(n) { $(this).html(players[id]+' Won!'); n() })
        .delay(2000)
        .queue(function(n) { $(this).html('Restarting...'); n() })
        .delay(2000)
        .queue(function(n) { $(this).html('5'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('4'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('3'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('2'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('1'); n() })
        .delay(1000)
        .queue(function(n) { $(this).html('Start!'); n() })
        .fadeOut(function() {
          root.playing = true
        })
    }

    // Exports
    // -------

    root.attack = attack
  })

})()

;(function() {

  // Font family definitions to be loaded, this should 
  // be trimmed to only the families used in production
  WebFontConfig = {
    google : {
      families : [
        'Shadows+Into+Light'
      ]
    }
  }

  // Add the Google script to the page to allow for the 
  // webfont declarations to be loaded
  var wf = document.createElement('script')
    , s = document.getElementsByTagName('script')[0]

  wf.src = '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
  wf.type = 'text/javascript'
  wf.async = 'true'
  s.parentNode.insertBefore(wf, s)

})()
