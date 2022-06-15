var httpServer = require('./httpServer.js');
var socket = require('socket.io');


// 实例化并启动服务
var httpServer = new httpServer(80);
httpServer.start();
module.exports = socket(httpServer.server);