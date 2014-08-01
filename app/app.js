var editor = ace.edit("game-rb-editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setFoldStyle('manual');
editor.getSession().setMode("ace/mode/ruby");
editor.getSession().setTabSize(2);
editor.getSession().setUseSoftTabs(true);
editor.getSession().setUseWrapMode(true);
editor.setDisplayIndentGuides(false);
editor.setHighlightActiveLine(true);
editor.setShowPrintMargin(false);
editor.setShowInvisibles(true);

var toggleConnectionStatus = function(className, message) {
    var messageBanner = document.getElementById('message-banner');
    messageBanner.children[0].className = className;
    messageBanner.children[0].innerHTML = message;
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

var handleFileSave = function() {
    var currentFileContent = editor.getValue();
    socket.emit('fileSave', { fileContent: currentFileContent });
};

var socket = io('http://localhost:8888/ruby'),
    terminal = document.getElementById('terminal'),
    terminalOutputs = document.getElementById('terminal-outputs'),
    terminalInput = document.getElementById('terminal-input'),
    sourceActionSave = document.getElementById('source-action-save'),
    sourceActionRun = document.getElementById('source-action-run');

terminal.addEventListener('click', function(e) { terminalInput.focus() }, false);
sourceActionSave.addEventListener('click', handleFileSave, false );
sourceActionRun.addEventListener('click', handleFileRun, false);

socket.on('connect', function() {
    toggleConnectionStatus('success', 'Server Connected');
    terminalInput.addEventListener('keypress', handleterminalInput, false);
});

socket.on('disconnect', function() {
    toggleConnectionStatus('warning', 'Server Disconnected');
    terminalInput.removeEventListener('keypress', handleterminalInput, false);
});

socket.on('ready', function(data) {
    window.console.log(data);
    addToTerminal(data.output, 'welcome');
    editor.setValue(data.fileContent);
    editor.gotoLine(0);
    //handleFileRun();
});

socket.on('terminalOutput', function(data) {
    window.console.log(data);
    addToTerminal(data.output, 'output');
});

socket.on('fileSaveComplete', function(data) {
    alert(data.result);
});
