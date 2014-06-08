var app = require('http').createServer(),
    io = require('socket.io').listen(app),
    exec = require('child_process').execFile;

var tones = io.of('/ruby').on('connection', function(socket) {
    socket.on('scriptIn', function(data) {
        console.log(data);

        exec('ruby', ['-e', data.script], function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);

            socket.emit('scriptOut', {
                result: stdout,
                error: stderr
            });
        });
    });
    socket.emit('ready', {
        result: 'Enter valid ruby code...'
    });
});

app.listen(process.env.PORT || 8888);
