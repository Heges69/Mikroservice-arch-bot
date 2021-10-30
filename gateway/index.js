require('dotenv').config();
const Quartz = require('@botsocket/quartz');
const ws = require('ws');
require('colors');

const wss = new ws.WebSocketServer({
    port: 3000,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        concurrencyLimit: 10,
        threshold: 1024 
    }
})

const client = Quartz.client('wss://gateway.discord.gg', {
    token: process.env.token,
    shard: [0, 5]
})
var clients = [];
client.onDispatch = (evt, data) => {
    clients = clients.filter(f => !(f.readyState == 2 || f.readyState == 3));
    if(clients.length == 0) return;
    const clt = clients[Math.floor(Math.random() * clients.length)];
    clt.send(JSON.stringify({e: evt, d: data}));
}
wss.on('connection', s => {
    console.log(`${'[CONNECTION]'.bgYellow.black} ${'|'.bold} New client connected to the gateway`)
    clients.push(s);
    s.on('message', msg => {
        client.send(JSON.parse(msg));
    })
})
wss.once('connection', () => { client.connect() })
