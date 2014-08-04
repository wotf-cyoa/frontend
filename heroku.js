var express = require('express');
var app = express();

// Routing
app.use(express.static(__dirname + '/public'));

app.listen(3000);
