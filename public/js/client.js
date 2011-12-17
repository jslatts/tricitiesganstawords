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
    var w = $('#holder').width()
      , h = $('#holder').height()
      , defaultSpeed = 10
      , wbottom = h - 60
      , rbottom = h - 33
      , rtop = h + 10
    


    $(window).resize(function(){
         w = $('#holder').width()
         h = $('#holder').height()
         paper.setSize(w,h)
    })
    var paper = Raphael('holder', w,h)

    var youWords = {'bottomHeight': 12
      , 'columnLocation': w/4
      , 'words': {}}
    var themWords = {'bottomHeight': 12
      , 'columnLocation': w*3/4
      , 'words': {}}

    var drop = function(t, fromBottom ) {
      yDest = wbottom-fromBottom
      t.animate({y: yDest}, ((yDest-t.attrs.y)*defaultSpeed))
    }

    function reStackWords(wordList) {
      wordList.bottomHeight = 12
      Object.keys(wordList.words).forEach(function(word) {
        drop(wordList.words[word], wordList.bottomHeight)
        wordList.bottomHeight += 12
      })
    }

    exports.destroyWord = function(destroyWord, isMe) {
      destroyWord = destroyWord.toLowerCase()
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
      attackWord = attackWord.toLowerCase()
      console.log('Incoming word received ' + attackText + ' for ' + isMe ? 'me' : 'them')
      var attackText = paper.text(isMe 
          ? themWords.columnLocation 
          : youWords.columnLocation, 30, attackWord)

      attackText.attr({'font-size': 16}).toFront()

      if (!isMe) {
        attackText.node.setAttribute('class', 'word you')
        youWords.words[attackWord] = attackText 
        youWords.bottomHeight += 12
        drop(attackText, youWords.bottomHeight)
      }
      else {
        attackText.node.setAttribute('class', 'word them')
        themWords.words[attackWord] = attackText
        themWords.bottomHeight += 12
        drop(attackText, themWords.bottomHeight)
      }

    }

    var spacer = 1
    var resetSpacer
    var currentWord = ''
    var text = paper.text(w/2, rbottom, currentWord)

    function addLetter(letter) {
      currentWord += letter
      spacer += 1
      text.attr({'text': currentWord, 'font-size': 16}).toFront()
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
      if (ev.keyCode === 13) {
        attack(currentWord, function(err) {
          resetWord()
        })
      }
      else {
        var letter = String.fromCharCode(ev.charCode)
        addLetter(letter)
      }
    }
  }
}())
