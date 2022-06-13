
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
    console.log ("Receive", data);
    switch (parts[0]) {
        case 'DROP': 
            playAt (parts[1]);
            break;
        case 'FREQ': 
            freq (parseFloat(parts[1]));
            break;    }
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

function postMessageF (adr, val) {
    let msg = inscore.newMessage();
    inscore.msgAddF (msg, val);
    inscore.postMessage(adr, msg)
}

function playAt (date) {
    let delay = getDelay(date);
    setTimeout( () => { postMessageF("/ITL/scene/faust/faust/drop", 1);}, delay);
}

function freq (freq) {
    postMessageF("/ITL/scene/faust/faust/bubble/freq", freq);
    playAt(gTime.now() + gNetMaxLatency);
}

var gTime = timesync.create({
    server: '/timesync',
    interval: 10000
});
if (!gTime) console.log ("Failed to create timesync");
connect();