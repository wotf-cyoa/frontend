var express = require('express'),
    exec = require('child_process').exec,
    app = express();

exec('brunch b', function(error, stdout, stderr) {
    console.log(error);
    console.log(stdout);
    console.log(stderr);
});

// Routing
app.use(express.static(__dirname + '/public'));

app.listen(3000);
