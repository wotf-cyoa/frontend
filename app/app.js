var toggleConnectionStatus = function(display) {
    var connStatus = document.getElementById('conn-status');
    connStatus.innerHTML = display;
};

var addToConsole = function(console, value, type) {
    var classes = 'console console-' + type;
    value = value.replace(/&/g, '&amp;')
                 .replace(/>/g, '&gt;')
                 .replace(/</g, '&lt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&apos;');
    console.innerHTML += '<p class="' + classes + '">' + value + '</p>';
};

var handleconsoleInput = function(event) {
    var key = event.which || event.keyCode;
    if (key == 13) {
        event.preventDefault();
        socket.emit('consoleInput', { input: consoleInput.value });
        addToConsole(consoleOutputs, consoleInput.value, 'in');
        consoleInput.value = '';
    }
};

var socket = io('http://localhost:8888/ruby'),
    consoleOutputs = document.getElementById('console-outputs'),
    consoleInput = document.getElementById('console-input');

socket.on('connect', function() {
    toggleConnectionStatus('<span class="success">Server Connected</span>');
    consoleInput.addEventListener('keypress', handleconsoleInput, false);
});

socket.on('disconnect', function() {
    toggleConnectionStatus('<span class="warning">Server Disconnected</span>');
    consoleInput.removeEventListener('keypress', handleconsoleInput, false);
});

socket.on('ready', function(data) {
    window.console.log(data);
    addToConsole(consoleOutputs, data.output, 'welcome');
});

socket.on('consoleOutput', function(data) {
    window.console.log(data);
    addToConsole(consoleOutputs, data.output, 'out');
});
