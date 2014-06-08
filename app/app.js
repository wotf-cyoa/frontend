var toggleConnectionStatus = function(display) {
    var conn_status = document.getElementById('conn-status');
    conn_status.innerHTML = display;
};

var addToConsole = function(console, value, type) {
    var classes = 'script script-' + type;
    value = value.replace(/&/g, '&amp;')
                 .replace(/>/g, '&gt;')
                 .replace(/</g, '&lt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&apos;');
    console.innerHTML += '<p class="' + classes + '">' + value + '</p>';
};

var socket = io.connect('http://localhost:8888/ruby');

socket.on('connect', function() {

    toggleConnectionStatus('<span class="success">Server Connected</span>');

    var scriptResults = document.getElementById('script-results');
    var scriptInput = document.getElementById('script-input');

    socket.on('ready', function(data) {
        window.console.log(data);
        addToConsole(scriptResults, data.result, 'welcome');
    });

    socket.on('scriptOut', function(data) {
        window.console.log(data);
        addToConsole(scriptResults, data.error || data.result, 'out');
    });

    scriptInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key == 13) {
            e.preventDefault();
            socket.emit('scriptIn', { script: scriptInput.value });
            addToConsole(scriptResults, scriptInput.value, 'in');
            scriptInput.value = '';
        }
    });

    socket.on('disconnect', function() {
        toggleConnectionStatus('<span class="warning">Server Disconnected</span>');
        scriptInput.removeEventListener('keypress');
    });
});
