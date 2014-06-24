var toggleConnectionStatus = function(display) {
    var connStatus = document.getElementById('conn-status');
    connStatus.innerHTML = display;
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

var handleScriptInput = function(event) {
    var key = event.which || event.keyCode;
    if (key == 13) {
        event.preventDefault();
        socket.emit('scriptInput', { input: scriptInput.value });
        addToConsole(scriptOutputs, scriptInput.value, 'in');
        scriptInput.value = '';
    }
};

var socket = io('http://localhost:8888/ruby'),
    scriptOutputs = document.getElementById('script-outputs'),
    scriptInput = document.getElementById('script-input');

socket.on('connect', function() {
    toggleConnectionStatus('<span class="success">Server Connected</span>');
    scriptInput.addEventListener('keypress', handleScriptInput, false);
});

socket.on('disconnect', function() {
    toggleConnectionStatus('<span class="warning">Server Disconnected</span>');
    scriptInput.removeEventListener('keypress', handleScriptInput, false);
});

socket.on('ready', function(data) {
    window.console.log(data);
    addToConsole(scriptOutputs, data.output, 'welcome');
});

socket.on('scriptOutput', function(data) {
    window.console.log(data);
    addToConsole(scriptOutputs, data.output, 'out');
});
