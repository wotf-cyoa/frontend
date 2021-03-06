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
editor.setReadOnly(true);

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

var handleHashChange = function(event) {
    if (window.location.hash !== '#' + localStorage.getItem('userid')) {
        window.location.reload();
    }
};

var userid = window.location.hash.replace(/#/, '') || localStorage.getItem('userid') || '';
localStorage.setItem('userid', userid);

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
    socket.emit('reportUserid', {
      userid: localStorage.getItem('userid'),
      authid: localStorage.getItem('authid')
    });

    addToTerminal('Server connected.', 'status');
    terminalInput.addEventListener('keypress', handleterminalInput, false);
    sourceActionBuild.addEventListener('click', handleCodeBuild, false);
    editor.setReadOnly(false);
});

socket.on('disconnect', function() {
    addToTerminal('Server disconnected.', 'error');
    terminalInput.removeEventListener('keypress', handleterminalInput, false);
    sourceActionBuild.removeEventListener('click', handleCodeBuild, false);
    editor.setReadOnly(true);
});

socket.on('ready', function(data) {
    addToTerminal(data.output, 'status');
    editor.setValue(data.fileContent);
    editor.gotoLine(0);
});

socket.on('confirmUserid', function(data) {
    localStorage.setItem('userid', data.userid);
    localStorage.setItem('authid', data.authid);
    if (window.location.hash !== '#' + data.userid) {
        window.location.replace('#' + data.userid);
    }
    window.addEventListener('hashchange', handleHashChange, false);
});

socket.on('terminalOutput', function(data) {
    addToTerminal(data.output, 'output');
});

socket.on('terminalError', function(data) {
    addToTerminal(data.output, 'error');
});

socket.on('buildStatus', function(data) {
    addToTerminal(data.output, 'status');
});
