var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
//var nicknames = [];
var users = {};

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function(){
	console.log('server is up!');
});


io.sockets.on('connection', function(socket){

	socket.on('new user', function(data, callback){
		//if(nicknames.indexOf(data) != -1){
		if(data in users){
			callback(false);
		} else {
			callback(true);
			socket.nickname = data;
			//nicknames.push(socket.nickname);
			users[socket.nickname] = socket;
			updateNickname();
		}
	});

	function updateNickname(){
		//io.sockets.emit('username', nicknames);
		io.sockets.emit('username', Object.keys(users));
	}

	socket.on('send message', function(data, callback){
		var msg = data.trim();
		if(msg.substr(0,3) === '/w '){
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if(ind !== -1){
				var name = msg.substring(0,ind);
				var msg = msg.substring(ind+1);
				if(name in users){
					users[name].emit('whisper', { msg : msg, nick : socket.nickname });
				} else {
					callback('Error : Enter a valid user!');
				}
			} else {
				callback('Error : Please enter message!!');
			}
		} else {
			io.sockets.emit('new message', { msg : data, nick : socket.nickname });
			//socket.broadcast.emit('new message', data);
		}
	});

	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		//nicknames.splice(nicknames.indexOf(socket.nickname),1);
		delete users[socket.nickname];
		updateNickname();
	});
});