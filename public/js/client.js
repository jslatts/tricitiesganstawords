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
    var w = $(window).width()
      , h = $(window).height() - 100
      , defaultSpeed = 10


    $(window).resize(function(){
         w = $(window).width()
         h = $(window).height()
         paper.setSize(w,h)
         redraw_element() // code to handle re-drawing, if necessary
    })
    var paper = Raphael('holder', w,h)

    //Draw input area
    var inputArea = paper.rect((w-400)/2, h-50, 400, 40, 10); 
    var youTitle = paper.text(w/4-100, 12, 'You')
    youTitle.attr({'font-size': 32})
    var themTitle = paper.text(w*3/4+100, 12, 'Them')
    themTitle.attr({'font-size': 32})

    //Calls back with fn(err)
    function attack(word, fn) {
      //return fn('crappy word') //sad
      exports.incomingWord(word)
      return fn && fn() //happy
    }


    youWords = {'bottomHeight': 12, 'words': {}}
    themWords = {'bottomHeight': 12, 'words': {}}

    var drop = function(t, yDest ) {
      t.animate({y: yDest}, ((yDest-t.attrs.y)*defaultSpeed))
    }

    function reStackWords(wordList) {
      wordList.bottomHeight = 12
      Object.keys(wordList.words).forEach(function(word) {
        drop(wordList.words[word], h-(10+wordList.bottomHeight))
        wordList.bottomHeight += 12
      })
    }

    exports.destroyWord = function(destroyWord, isMe) {
      if (isMe) {
        youWords.words[destroyWord].attr({'text': ''})
        delete youWords.words[destroyWord]
        reStackWords(youWords)
      }
      else {
        themWords.words[destroyWord].attr({'text': ''})
        delete themWords.words[destroyWord]
        reStackWords(themWords)
      }
    }

    exports.incomingWord = function(attackWord, isMe) {
      isMe = true
      console.log('Incoming word received ' + attackText + ' for ' + isMe ? 'me' : 'them')
      var attackText = paper.text(isMe ? w/4-100 : w*3/4+100, 30, attackWord)
      attackText.attr({'font-size': 16}).toBack()

      if (isMe) {
        youWords.words[attackWord] = attackText 
        youWords.bottomHeight += 12
        drop(attackText, h-(10+youWords.bottomHeight))
      }
      else {
        themWords.words[attackWord] = attackText
        themWords.bottomHeight += 12
        drop(attackText, h-(10+themWords.bottomHeight))
      }

    }

    var spacer = 1
    var resetSpacer
    var currentWord = ''
    var text = paper.text((w)/2, h-30, currentWord)

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
