var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({port : 8080}),
    anyClients = false,
    intervalObject = null;

var changeBroadcastingState = function(state) {
    if (state) {
        intervalObject = setInterval(wss.broadcast, 500);
    } else {
        if (intervalObject) {
            clearInterval(intervalObject);
        }
    }
}

wss.on('open', function open() {
    if (!anyClients) {
        changeBroadcastingState(true);
    }
    console.log('New client connected');
});

wss.on('close', function close() {
    if (wss.clients.length == 0){
        changeBroadcastingState(false);
    }
    console.log('Client disconnected');
});

wss.broadcast = function broadcast() {
    var min = 0,
        max = 100;
    wss.clients.forEach(function each(client) {
        var data = Math.floor(Math.random() * (max - min)) + min;
        client.send(data);
    });
};

console.log("Server running at http://127.0.0.1:8080/");