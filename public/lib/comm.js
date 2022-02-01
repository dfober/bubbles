
var ws = null;
var gNetMaxLatency = 300;

function connect (url) {
    if (!url)
        url = location.origin.replace(/^http/, 'ws');
    ws = new WebSocket(url);
    if (ws) {
        ws.onmessage = function(msg) { receive (msg.data); };
        console.log ("Connected to", url)
        setInterval(() => { ws.send ('dummy'); }, 20000);
    }
    else console.log ("Failed to connect to", url);
}

function receive (data) {
    const parts = data.split(' ');
    switch (parts[0]) {
        case 'DROP': 
            console.log ("Receive", data);
            playAt (parts[1]);
            break;
    }
}

function drop () { 
    let date = gTime.now() + gNetMaxLatency;
    ws.send ('DROP ' + date); 
}

function getDelay(date) {
    let n = date - gTime.now();
    if (n < 0) console.log("late event detected: delay", n)
    return (n > 0) ? n : 0;
}

function playAt (date) {
    let delay = getDelay(date);
    let msg = inscore.newMessage();
    inscore.msgAddF (msg, 1);
    setTimeout( () => { inscore.postMessage("/ITL/scene/faust/faust/drop", msg);}, delay);
}

var gTime = timesync.create({
    server: '/timesync',
    interval: 10000
});
if (!gTime) console.log ("Failed to create timesync");
connect();