var app = require('http').createServer(),
    io = require('socket.io').listen(app),
    exec = require('child_process').execFile;

var tones = io.of('/ruby').on('connection', function(socket) {
    socket.on('terminalInput', function(data) {
        console.log(data);

        exec('ruby', ['-e', data.input], function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);

            socket.emit('terminalOutput', {
                output: stderr || stdout
            });
        });
    });
    socket.emit('ready', {
        output: 'Enter valid ruby code...'
    });
});

app.listen(process.env.PORT || 8888);
