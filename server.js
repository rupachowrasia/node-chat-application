var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var nicknames = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});



server.listen(3000, function(){
	console.log('server is up!');
});

io.sockets.on('connection', function(socket){

	socket.on('new user', function(data, callback){
		if(nicknames.indexOf(data) != -1){
			callback(false);
		}
	});

	socket.on('send message', function(data){
		io.sockets.emit('new message', data);
		//socket.broadcast.emit('new message', data);

	});
});