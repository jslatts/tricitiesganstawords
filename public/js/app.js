
  
var words = [
  'hey'
, 'there'
, 'hows'
, 'it'
, 'going'
]

;(function() {
  
  $(function() {

    var blockInput = $('#block')
      , attackInput = $('#attack')
      , incommingList = $('#incomming-list')
      , outgoingList = $('#outgoing-list')
      , usedList = $('#used-list')

    // Blocking
    // --------

    function addWord(str) {
      incommingList.append('<li word="'+str+'">'+str+'</li>')
    }

    function removeWord(str) {
      incommingList
        .find('[word="'+str+'"]')
        .remove()
    }

    function block(e) {
      console.log('block', this, $(this))
      if (e.keyCode !== 13) return

      var val = blockInput.val()
        , x = words.indexOf(val)
      
      // Make sure index at start of the word
      if (x === 0) {
        console.log('blocked!', words[x])
        words.splice(x, 1)
        removeWord(val)
        incommingList
          .stop()
          .effect("highlight", {
            color: 'green'
          }, 500)
        
      } else {
        $('#keyboard')
          .stop()
          .effect("highlight", {
            color: '#F00000'
          }, 500)
      }
      blockInput.val('')
    }
    blockInput.bind('keypress', block)

    // Attacking
    // ---------

    function attack(e) {
      
    }
    attackInput.bind('keypress', attack)

    words.forEach(function(str) {
      addWord(str)
    })

  })

})()
