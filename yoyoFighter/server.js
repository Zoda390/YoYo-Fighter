var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
console.log("The server is running");

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('New connection: ' + socket.id);
    
    socket.on('new_player', new_player);

    function new_player(data){
        console.log(data);
        socket.broadcast.emit('NEW_PLAYER', data);
    }
}


