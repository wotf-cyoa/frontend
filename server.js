var app = require('http').createServer(),
    io = require('socket.io').listen(app),
    spawn = require('child_process').spawn,
    fs = require('fs');

var tones = io.of('/ruby').on('connection', function(socket) {

    var ruby = spawn('irb');

    ruby.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        socket.emit('terminalOutput', {
            output: data.toString()
        });
    });

    ruby.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
        socket.emit('terminalOutput', {
            output: data.toString()
        });
    });

    ruby.on('close', function(code) {
        console.log('Exit code: ' + code);
    });

    socket.on('fileInput', function(data) {
        console.log(data);
        ruby.stdin.write('exec($0)\n', function() {
            ruby.stdin.write(data.input + '\n');
        });
    });

    socket.on('terminalInput', function(data) {
        console.log(data);
        ruby.stdin.write(data.input + '\n');
    });

    socket.emit('ready', {
        output: 'Enter valid ruby code...'
    });
});

app.listen(process.env.PORT || 8888);
