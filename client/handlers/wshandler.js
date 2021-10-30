const ws = require('ws');
const { EventEmitter } = require('events');

class wshandler extends EventEmitter{
    constructor(url) {
        super();
        this.url = url;
    }
    login() {
        this.ws = new ws(this.url);
        this.ws.once('open', () => {
            this.emit('ready');
        })
        this.ws.on('message', (m) => this.emit('event', JSON.parse(Buffer.from(m).toString())));
    }
    send(d){
        this.ws.send(JSON.stringify(d));
    }
}

module.exports = wshandler;