
// Client to server connector
// ==========================

;(function() {

  var root = this
    , socket = io.connect()
    , hud
    , usedWords
    , players
  
  root.attackWords = {}
  root.usedWords = {}
  root.playerId = null
  root.playerName = null
  root.playing = true;
  root.players = null;

  // Socket listeners
  // ----------------

  console.log('socket', socket.socket)

  $(function() {

    usedWords = $('#used-words')
    hud = $('#hud')
    players = $('#players')

    function handleUsed(str, id) {
      root.usedWords[str] = id
      usedWords.prepend('<li>'+str+'</li>')
    }

    socket.on('connect', function() {
      root.playerId = socket.socket.sessionid

      root.playerName = prompt('Enter your name:', '')

      socket.emit('name', root.playerName)

      socket.on('used', function(words) {
        if (!words) return
        Object.keys(words).forEach(function(str) {
          usedWords.prepend('<li>'+str.toUpperCase()+'</li>')
        })
      })

      socket.on('players', function(people) {
        if (!people) return
        root.players = people;
        players.empty()
        Object.keys(people).forEach(function(person) {
          players.append('<li>'+people[person].name+'</li>')
        })
      })

      socket.on('attack', function(str, id) {
        if (root.playing) {
          str = str.toLowerCase().trim()
          handleUsed(str, id)
          root.exports.incomingWord(str, (id === root.playerId))
        }
      })

      socket.on('block', function(str, id) {
        if (root.playing) {
          str = str.toLowerCase().trim()
          root.exports.destroyWord(str, (id === root.playerId))
        }
      })

      socket.on('lose', function(id) {
        if (root.playing) {
          if (id === root.playerId) {
            root.playing = false;
            alert('You lost')
          } else {
            //
          }
        }
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
