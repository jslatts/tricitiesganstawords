(function() {
  //Setup
  exports = typeof exports !== 'undefined' ? exports : {}
  window.onload = function() {
    $(document).unbind('keypress');

    $(document).keypress(function (e) {
       if ( e.target.nodeName.toUpperCase() != 'TEXTAREA' ) {
          var code = (e.keyCode ? e.keyCode : e.which);
          if ( code == 8 ) return false;
       }
    });
    var w = $(window).width(), 
        h = $(window).height() - 100


    $(window).resize(function(){
         w = $(window).width()
         h = $(window).height()
         paper.setSize(w,h)
         redraw_element() // code to handle re-drawing, if necessary
    })
    var paper = Raphael('holder', w,h)

    //Calls back with fn(err)
    function attack(word, fn) {
      //return fn('crappy word') //sad
      exports.incomingWord(word)
      return fn && fn() //happy
    }


    exports.words = words = {}

    var drop = function(t) {
      t.animate({y: h-(10+bottomHeight)}, 10000)
    }

    var bottomHeight = 12

    exports.incomingWord = function(attackWord) {
      var attackText = paper.text(w/4, 20, attackWord)
      attackText.attr({'font-size': 16}).toBack()
      drop(attackText)
      words[attackWord] = {'falling': true}
      bottomHeight +=12
    }

    var spacer = 1
    var resetSpacer
    var currentWord = ''
    var text = paper.text(w*3/4, 20, currentWord)

    function addLetter(letter) {
      currentWord += letter
      spacer += 1
      text.attr({'text': currentWord, 'font-size': 16}).toBack()
    }

    function deleteLetter() {
      currentWord = currentWord.substring(0, currentWord.length -1)
      spacer -= 1
      text.attr({'text': currentWord, 'font-size': 16}).toBack()
    }

    function resetWord() {
      currentWord = ''
      text.attr({'text': ''}).toBack()
      spacer = 1
    }

    document.onkeydown = function(ev) {
      if ( ev.keyCode === 8 ) { 
        ev.keyCode = 0
        ev.returnValue = false
        deleteLetter() 
        return false
      }
    }

    //Handle keystrokes to get new words
    document.onkeypress = function(ev) {
      console.log('char code is ' + ev.charCode)
      if (ev.keyCode === 13) {
        $('#hud').fadeOut()
        attack(currentWord, function(err) {
          if (err) {
            console.log('Word not valid or has been used')
            $('#hud').fadeIn()
            return
          }
          else {
            resetWord()
          }
        })
      }
      else {
        var letter = String.fromCharCode(ev.charCode)
        addLetter(letter)
      }
    }
  }
}())
