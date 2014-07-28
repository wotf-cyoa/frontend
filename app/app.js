var editor = ace.edit("game-rb-editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/ruby");
editor.getSession().setTabSize(2);
editor.getSession().setUseSoftTabs(true);

var toggleConnectionStatus = function(display) {
    var connStatus = document.getElementById('conn-status');
    connStatus.innerHTML = display;
};

var addToTerminal = function(value, type) {
    var classes = 'outputs outputs-' + type;
    value = value.replace(/&/g, '&amp;')
                 .replace(/>/g, '&gt;')
                 .replace(/</g, '&lt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&apos;')
                 .replace(/\n/g, '<br>');
    terminalOutputs.innerHTML += '<p class="' + classes + '">' + value + '</p>';
    terminalInput.scrollIntoView();
};

var handleterminalInput = function(event) {
    var key = event.which || event.keyCode;
    if (key == 13) {
        event.preventDefault();
        socket.emit('terminalInput', { input: terminalInput.value });
        addToTerminal(terminalInput.value, 'input');
        terminalInput.value = '';
    }
};

var handleFileRun = function() {
    var currentFileContent = editor.getValue();
    socket.emit('fileInput', { input: currentFileContent });
    addToTerminal('Running game...', 'input');
};

var socket = io('http://localhost:8888/ruby'),
    terminal = document.getElementById('terminal'),
    terminalOutputs = document.getElementById('terminal-outputs'),
    terminalInput = document.getElementById('terminal-input'),
    sourceActionSave = document.getElementById('source-action-save'),
    sourceActionRun = document.getElementById('source-action-run');

terminal.addEventListener('click', function(e) { terminalInput.focus() }, false);
sourceActionSave.addEventListener('click', function(e) { alert('Files saved!') }, false );
sourceActionRun.addEventListener('click', handleFileRun, false);

socket.on('connect', function() {
    toggleConnectionStatus('<span class="success">Server Connected</span>');
    terminalInput.addEventListener('keypress', handleterminalInput, false);
});

socket.on('disconnect', function() {
    toggleConnectionStatus('<span class="warning">Server Disconnected</span>');
    terminalInput.removeEventListener('keypress', handleterminalInput, false);
});

socket.on('ready', function(data) {
    window.console.log(data);
    addToTerminal(data.output, 'welcome');
    handleFileRun();
});

socket.on('terminalOutput', function(data) {
    window.console.log(data);
    addToTerminal(data.output, 'output');
});
