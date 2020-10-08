const hostname = '127.0.0.1';
// server ip
const port = 8081;
// connection port

const http = require('http');
http.createServer(require('./back/index')).listen(port, hostname);

console.log(`listening on http://${hostname}:${port}`);