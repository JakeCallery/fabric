/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 5/6/13
 * Time: 12:20 PM
 * To change this template use File | Settings | File Templates.
 */

var Events = require('events');
var UUID = require('node-uuid');
module.exports = Client;

function Client($connection, $globalConnectionIndex, $type) {

	//super
	Events.EventEmitter.call(this);

	var self = this;

	//TODO: Do a check for collisions within group on group add, recalc if needed
	this.id = UUID.v4().split('-').join('');
	//Hack to make sure first character isn't a number (used as a map property in client)
	if(!isNaN(this.id.charAt(0))){
		this.id = 'Z' + this.id;
	}
	this.connection = $connection;
	this.group = null;
	this.connectionIndex = $globalConnectionIndex;
	this.type = $type;

	var handleMessage = function($message){
		self.emit('message', self, $message);
	};

	var handleClose = function($reasonCode, $description){
		self.emit('close', self, $reasonCode, $description);
	};

	//Add listeners
	this.connection.addListener('close', handleClose);
	this.connection.addListener('message', handleMessage);

	this.sendMessage = function($message){
		if($message.type === 'utf8'){
			self.connection.sendUTF($message.utf8Data);
		} else if($message.type === 'binary'){
			self.connection.sendBytes($message.binaryData);
		}
	};

	this.destroy = function(){
		self.connection.removeListener('close', handleClose);
		self.connection = null;
		self.group = null;
		self.connectionIndex = null;
	}
}

Client.super_ = Events.EventEmitter;
Client.prototype = Object.create(Events.EventEmitter.prototype, {
	constructor: {
		value: Client,
		enumerable: false
	}
});