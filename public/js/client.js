(function() {

    //Calls back with fn(err)
    function attack(word, fn) {
      //return fn('crappy word') //sad
      return fn && fn() //happy
    }

    if (typeof exports === 'undefined') {
      exports = {}
    }

    exports.words = words = {}

    window.onload = function() {
    var w = $(window).width(), 
        h = $(window).height() - 100

    var paper = Raphael('holder', w,h)

    $(window).resize(function(){
         w = $(window).width()
         h = $(window).height()
         paper.setSize(w,h)
         redraw_element() // code to handle re-drawing, if necessary
    })

    var spacer = 1
    var resetSpacer
    var currentWord = ''
    var bottomHeight = 12
    var text = paper.text(w/2, 20, currentWord)

    var drop = function(t) {
      t.animate({y: h-(10+bottomHeight)}, 1000)
    }

    //Handle keystrokes to get new words
    document.onkeypress = function(ev) {
      if (ev.keyCode === 13) {
        $('#hud').fadeOut()
        attack(currentWord, function(err) {
          if (err) {
            console.log('Word not valid or has been used')
            $('#hud').fadeIn()
            return
          }
          else {
            words[currentWord] = {'falling': true}
            drop(text)
            spacer = 1
            currentWord = ''
            bottomHeight +=12
            text = paper.text(w/2, 20, '')
          }
        })
      }

      console.log('char code is ' + ev.charCode)
      var letter = String.fromCharCode(ev.charCode)
      currentWord += letter

      spacer += 1
      text.attr({'text': currentWord, 'font-size': 16}).toBack()
    }
  }
}())
