

var WebSocket = require("ws")
var http = require("http")
var express = require("express")
var timesyncServer = require('timesync/server');

var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/public"))
app.use('/timesync', timesyncServer.requestHandler);

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocket.WebSocketServer({server: server})
console.log ("INScore Web Socket Broadcaster is running");

wss.on('connection', function connection(ws) {
  console.log ("new connection - clients count", wss.clients.size)
  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});

