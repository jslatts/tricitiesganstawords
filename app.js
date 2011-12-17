
var express = require('express')
  , colors = require('colors')
  , app = express.createServer()


app.configure('production', function() {
  app.use(express.bodyParser())
  app.use(express.cookieParser())
  app.use(express.methodOverride())
  app.use(express.static(__dirname + '/public', {maxAge: 360000}))
  app.use(express.errorHandler({
    dumpExceptions: true
  , showStack: true
  }))
})


app.get('/', function(req, res) {
  res.render('index.html', {
    
  })
})


app.listen(4000, function() {
  console.log("Server configured for: ".green + (global.process.env.NODE_ENV || 'development') + " environment.".green)
  console.log("Server listening on port: ".green + app.address().port)
  console.log("")
})
