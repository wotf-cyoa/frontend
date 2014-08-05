var editor = ace.edit('game-rb-editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setFoldStyle('manual');
editor.getSession().setMode("ace/mode/ruby");
editor.getSession().setTabSize(2);
editor.getSession().setUseSoftTabs(true);
editor.getSession().setUseWrapMode(true);
editor.setDisplayIndentGuides(false);
editor.setHighlightActiveLine(true);
editor.setShowPrintMargin(false);
editor.setShowInvisibles(true);

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

var handleCodeBuild = function() {
    var currentFileContent = editor.getValue();
    addToTerminal('Build started...', 'status');
    socket.emit('codeBuild', { fileContent: currentFileContent });
};

// Set socket URL based on environment
var socketURL = 'http://wotf-cyoa.herokuapp.com:80/ruby';
if (window.location.origin === 'http://localhost:3333')
    socketURL = 'http://localhost:8888/ruby';

var socket = io(socketURL),
    terminal = document.getElementById('terminal'),
    terminalOutputs = document.getElementById('terminal-outputs'),
    terminalInput = document.getElementById('terminal-input'),
    sourceActionBuild = document.getElementById('source-action-build');

terminal.addEventListener('click', function(e) { terminalInput.focus() }, false);

socket.on('connect', function() {
    addToTerminal('Server connected.', 'status');
    terminalInput.addEventListener('keypress', handleterminalInput, false);
    sourceActionBuild.addEventListener('click', handleCodeBuild, false);
});

socket.on('disconnect', function() {
    addToTerminal('Server disconnected.', 'error');
    terminalInput.removeEventListener('keypress', handleterminalInput, false);
    sourceActionBuild.removeEventListener('click', handleCodeBuild, false);
});

socket.on('ready', function(data) {
    addToTerminal(data.output, 'status');
    editor.setValue(data.fileContent);
    editor.gotoLine(0);
});

socket.on('terminalOutput', function(data) {
    //if (data.output.indexOf('Error') > -1 || data.output.indexOf('undefined') > -1)
    //    addToTerminal(data.output, 'error');
    //else addToTerminal(data.output, 'output');
    addToTerminal(data.output, 'output');
});

socket.on('terminalError', function(data) {
    addToTerminal(data.output, 'error');
});

socket.on('buildStatus', function(data) {
    addToTerminal(data.output, 'status');
});

