var toggleConnectionStatus = function(display) {
    var conn_status = document.getElementById('conn-status');
    conn_status.innerHTML = display;
};

var socket = io.connect('http://localhost:8888/ruby');

socket.on('connect', function() {

    toggleConnectionStatus('<span class="success">Server Connected</span>');

    var scriptResults = document.getElementById('script-results');
    var scriptInput = document.getElementById('script-input');

    socket.on('ready', function(data) {
        console.log(data);
        scriptResults.innerHTML += '<p>' + data.result + '</p>';
    });

    socket.on('scriptOut', function(data) {
        console.log(data);
        scriptResults.innerHTML += '<p>' + (data.result || 'Error') + '</p>';
    });

    scriptInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key == 13) {
            e.preventDefault();
            socket.emit('scriptIn', { script: scriptInput.value });
            scriptInput.value = '';
        }
    });

    socket.on('disconnect', function() {
        toggleConnectionStatus('<span class="warning">Server Disconnected</span>');
        scriptInput.removeEventListener('keypress');
    });
});
