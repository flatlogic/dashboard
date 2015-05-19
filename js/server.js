var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8080 });

var chartClients = {},
    treeViewClients = {},
    terminalClients = {},
    consoleClients = {},
    newsClients = {};

wss.on('connection', function connection(ws) {
    switch(ws.upgradeReq.url) {
        case '/terminal':
            terminalClients[ws.upgradeReq.headers['sec-websocket-key']] = ws;
            break;
        case '/tree':
            treeViewClients[ws.upgradeReq.headers['sec-websocket-key']] = ws;
            break;
        case '/chart':
            chartClients[ws.upgradeReq.headers['sec-websocket-key']] = ws;
            break;
        case '/console':
            consoleClients[ws.upgradeReq.headers['sec-websocket-key']] = ws;
            break;
        case '/news':
            newsClients[ws.upgradeReq.headers['sec-websocket-key']] = ws;
            break;
        default:
            break;
    }
});

var removeSocket = function(from, hash) {
    switch(from) {
        case '/terminal':
            delete terminalClients[hash];
            break;
        case '/tree':
            delete treeViewClients[hash];
            break;
        case '/chart':
            delete chartClients[hash];
            break;
        case '/console':
            delete consoleClients[hash];
            break;
        default:
            break;
    }
}

// ----------------------------- CONSOLE SECTION -----------------------------------
var consoleMessages = [
    {
        id: 1,
        message: "Installing 1"
    },
    {
        id: 2,
        message: "Installing 2"
    },
    {
        id: 3,
        message: "Installing 3"
    },
    {
        id: 4,
        message: "Installing 4"
    }
];

var sendConsoleMessage = function() {
    var message = consoleMessages[Math.floor(Math.random() * consoleMessages.length)].message;
    for (var clientIndex in consoleClients) {
        var client = consoleClients[clientIndex];
        if (client.upgradeReq.socket.destroyed) {
            removeSocket(client.upgradeReq.url, client.upgradeReq.headers['sec-websocket-key']);
        } else {
            client.send(message);
        }
    }
};

var consoleInterval = setInterval(sendConsoleMessage, 1000);

// -------------------------------- CHART SECTION ---------------------------------

var sendChartMessage = function() {
    var message = {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100)
    }

    for (var clientIndex in chartClients) {
        var client = chartClients[clientIndex];
        if (client.upgradeReq.socket.destroyed) {
            removeSocket(client.upgradeReq.url, client.upgradeReq.headers['sec-websocket-key']);
        } else {
            client.send(JSON.stringify(message));
        }
    }
}

var chartInterval = setInterval(sendChartMessage, 1000);


// -------------------------------- TERMINAL SECTION ---------------------------------

var terminalMessages = [
    {
        id: 1,
        message: "Terminal message 1"
    },
    {
        id: 2,
        message: "Terminal message 2"
    },
    {
        id: 3,
        message: "Terminal message 3"
    },
    {
        id: 4,
        message: "Terminal message 4"
    }
];

var sendTerminalMessage = function() {
    var message = terminalMessages[Math.floor(Math.random() * terminalMessages.length)].message;
    for (var clientIndex in terminalClients) {
        var client = terminalClients[clientIndex];
        if (client.upgradeReq.socket.destroyed) {
            removeSocket(client.upgradeReq.url, client.upgradeReq.headers['sec-websocket-key']);
        } else {
            client.send(message);
        }
    }
};

var terminalInterval = setInterval(sendTerminalMessage, 1000);

// -------------------------------- TERMINAL SECTION ---------------------------------

var usersNames = [
    'John Doe',
    'Clark Vision',
    'Sara Konor'
];

var messages = [
    'Hey! What\'s up?',
    'Message 2',
    'Message 3. Yoooho!'
];

var newsMessageObject = function(){
    this.id = 0;
    this.user = '';
    this.message = '';
};



var sendNewsMessage = function() {
    var message = new newsMessageObject;
    message.id = 1;
    message.user = usersNames[Math.floor(Math.random() * usersNames.length)];
    message.message = messages[Math.floor(Math.random() * messages.length)];
    message.date = 'February 22, 2014 at 01:59 PM';

    for (var clientIndex in newsClients) {
        var client = newsClients[clientIndex];
        if (client.upgradeReq.socket.destroyed) {
            removeSocket(client.upgradeReq.url, client.upgradeReq.headers['sec-websocket-key']);
        } else {
            client.send(JSON.stringify(message));
        }
    }
};

var newsInterval = setInterval(sendNewsMessage, 1000);