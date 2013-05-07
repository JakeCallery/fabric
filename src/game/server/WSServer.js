/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 5/3/13
 * Time: 2:45 PM
 * To change this template use File | Settings | File Templates.
 */
"use strict";
process.title = 'WSServer';

var Group = require('./Group.js');
var Client = require('./Client.js');

//vars
var connections = [];
var groups = [];

//it someone hits us over http, send 404
var http = require('http');
var server = http.createServer(function(request, response){
	console.log((new Date()) + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});

//Set up socket server
var WebSocketServer = require('websocket').server;
var wsServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections:false
});

//Start listening on socket
server.listen(5252, function(){
	console.log((new Date() + ' Server is listening on port 5252'));
});

function originIsAllowed(origin){
	//TODO: actual origin checking
	return true;
}

//Wait for requests to make a new connection
wsServer.on('request', function(request){
	if(!originIsAllowed(request.origin)){
		request.reject();
		console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
		return;
	}

	//save off connection object
	var connection = request.accept('echo-protocol', request.origin);
	console.log((new Date()) + ' Connection accepted.');

	var groupId= '';
	var reqURL = request.resourceURL;
	if(reqURL.query.hasOwnProperty('group')){
		groupId = reqURL.query['group'];
	}

	console.log('GroupID: ' + groupId);

	//Keep track of client indexes
	console.log(Client);
	var clientIndex = connections.push(connection) - 1;
	var client = new Client(connection);

	var group = null;

	var groupFound = false;

	for(var g = 0; g < groups.length; g++){
		if(groups[g].id === groupId){
			//found
			groupFound = true;
			group = groups[g];
			break;
		}
	}

	if(groupFound === false){
		group = new Group(groupId);
		group.on('emptyGroup', function(){
			console.log('Group ' + group.id + ' is empty, removing...');
			var idx = groups.indexOf(group);
			groups.splice(idx,1);
			console.log('Num Groups: ' + groups.length);
		});
		groups.push(group);
	}

	if(group !== null){
		group.addClient(client);
	}

	//Listen for messages
	connection.on('message', function(message){
		console.log('Received Message: ' + message.utf8Data);

		if(message.type === 'utf8'){
			for(var i = 0; i < group.clients.length; i++){
				console.log('Sending utf8 Message to : ' + i + ' ' + message.utf8Data);
				group.clients[i].connection.sendUTF(message.utf8Data);
			}
		} else if(message.type === 'binary'){
			for(var c = 0; c < group.clients.length; c++){
				console.log('Sending Binary Message to : ' + c + ' ' + message.utf8Data);
				group.clients[c].connection.sendBytes(message.binaryData);
			}
		}
	});

	//Wait for close, and clean up client if needed
	connection.on('close', function(reasonCode, description){
		console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected. / ' + reasonCode + ': ' + description);
		connections.splice(clientIndex, 1);
	});


});


