var fs = require('fs');

var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {

  // read index.html
  fileContents = fs.readFileSync('./index.html');

  if (fileContents) {
  	response.send(fileContents.toString());	
  }

//  response.send('Hello World 2!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});