var app = require('http').createServer(),
    io = require('socket.io').listen(app),
    spawn = require('child_process').spawn,
    fs = require('fs');

var tones = io.of('/ruby').on('connection', function(socket) {

    var ruby = spawn('irb');

    ruby.stdout.pause();

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
        ruby.stdin.write('exec($0)\n');
        setTimeout(function() {
            ruby.stdin.write(data.input + '\n');
        }, 1000);
    });

    socket.on('terminalInput', function(data) {
        ruby.stdout.resume();
        console.log(data);
        ruby.stdin.write(data.input + '\n');
    });

    socket.on('fileSave', function(data) {
        console.log(data);
        fs.writeFile('games/game.rb', data.fileContent, function(err) {
            socket.emit('fileSaveComplete', {
                result: err || 'File saved.'
            });
        });
    });

    fs.readFile('games/game.rb', function(err, contents) {
        console.log(contents);
        socket.emit('ready', {
            output: 'Shell ready!',
            fileContent: contents.toString()
        });
    });
});

app.listen(process.env.PORT || 8888);
