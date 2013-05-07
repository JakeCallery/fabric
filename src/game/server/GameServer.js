/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 5/7/13
 * Time: 12:56 PM
 * To change this template use File | Settings | File Templates.
 */

module.exports = GameServer;

var Events = require('events');
var Group = require('./Group.js');
var Client = require('./Client.js');
var HTTP = require('http');
var WebSocketServer = require('websocket').server;

function GameServer($id){
	//super
	Events.EventEmitter.call(this);

	var self = this;

	//TODO: Switch to in-game protocol
	var protocol = 'echo-protocol';
	this.id = $id;

	var port = null;
	var connections = [];
	var groups = [];
	var httpServer = null;
	var wss = null;

	this.start = function($port){
		port = $port;
		httpServer = HTTP.createServer(onCreateServer);

		wss = new WebSocketServer({
			httpServer: httpServer,
			autoAcceptConnections: false
		});

		wss.addListener('request', handleWSRequest);

		httpServer.listen(port, onServerListen);

	};

	var checkValidProtocol = function($protoList){
		for(var i = 0; i < $protoList.length; i++){
			if($protoList[i] == protocol){
				return true;
			}
		}

		return false;
	};

	var handleWSRequest = function($request){

		if(checkOriginAllowed($request.origin) === false){
			$request.reject();
			console.log((new Date()) + ' Connection from origin ' + $request.origin + ' rejected.');
		} else if(!checkValidProtocol($request.requestedProtocols)){
			//bad protocol, reject
			$request.reject();
			console.log((new Date()) + ' Connection using bad protocol ' + $request.requestedProtocols + ', rejected.');
		} else {

			var conn = $request.accept(protocol, $request.origin);
			console.log((new Date()) + ' Connection accepted.');

			var groupId= '';

			var reqURL = $request.resourceURL;
			if(reqURL.query.hasOwnProperty('group')){
				groupId = reqURL.query['group'];
			}

			console.log('GroupID: ' + groupId);

			//Keep track of client indexes
			var connectionIndex = connections.push(conn) - 1;
			var client = new Client(conn, connectionIndex);
			client.addListener('close', handleConnClose);
			client.addListener('message', handleClientMessage);

			//Declare group bits
			var group = null;
			var groupFound = false;

			//See if group already exists
			for(var g = 0; g < groups.length; g++){
				if(groups[g].id === groupId){
					//found
					groupFound = true;
					group = groups[g];
					break;
				}
			}

			//Start new group if needed
			if(groupFound === false){
				group = new Group(groupId);
				group.addListener('emptyGroup', handleEmptyGroup);
				groups.push(group);
			}

			//Add new client to group
			if(group !== null){
				group.addClient(client);
			}
		}
	};

	var handleConnClose = function($client, $reasonCode, $description){
		console.log('Client Disconnect: ' + $client);
		var connection = $client.connection;
		console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected. / ' + $reasonCode + ': ' + $description);
		connections.splice($client.connectionIndex, 1);
		$client.removeListener('close', handleConnClose);
	};

	var handleEmptyGroup = function($group){
		console.log('Group ' + $group.id + ' is empty, removing...');
		var idx = groups.indexOf($group);
		groups.splice(idx,1);
		console.log('Num Groups: ' + groups.length);
		$group.removeListener('empty', handleEmptyGroup);
	};

	var handleClientMessage = function($client, $message){
		//for now echo to all clients in group
		var grp = $client.group;
		for(var i = 0, l=grp.clients.length; i < l; i++){
			if($message.type === 'utf8'){
				grp.clients[i].connection.sendUTF($message.utf8Data);
			} else if($message.type === 'binary'){
				grp.clients[i].connection.sendBytes($message.binaryData);
			}
		}
	};

	var checkOriginAllowed = function($origin){
		//TODO: Actual origin checking
		return true;
	};

	var onCreateServer = function($request, $response){
		console.log((new Date()) + ' HTTP Received request for ' + $request.url);
		$response.writeHead(404);
		$response.end();
	};

	var onServerListen = function(){
		console.log((new Date() + ' Server is listening on port ' + port));
	};



}

GameServer.super_ = Events.EventEmitter;
GameServer.prototype = Object.create(Events.EventEmitter.prototype, {
	constructor: {
		value: GameServer,
		enumerable: false
	}
});
