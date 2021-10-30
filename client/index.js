require('dotenv').config();
const { SnowTransfer } = require('snowtransfer');
const Wshandler = require('./handlers/wshandler');
const wshandler = new Wshandler('ws://localhost:3000');
const client = new SnowTransfer(process.env.token);

wshandler.login();
wshandler.on('event', data => {
    console.log(data);
})
