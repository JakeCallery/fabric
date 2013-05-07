/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 5/6/13
 * Time: 12:20 PM
 * To change this template use File | Settings | File Templates.
 */

var Events = require('events');
module.exports = Client;

function Client($connection, $globalConnectionIndex) {

	//super
	Events.EventEmitter.call(this);

	var self = this;

	this.connection = $connection;
	this.group = null;
	this.connectionIndex = $globalConnectionIndex;

	var handleMessage = function($message){
		self.emit('message', self, $message);
	};

	var handleClose = function($reasonCode, $description){
		self.emit('close', self, $reasonCode, $description);
	};

	//Add listeners
	this.connection.addListener('close', handleClose);
	this.connection.addListener('message', handleMessage);

	this.destroy = function(){
		this.connection.removeListener('close', handleClose);
		this.connection = null;
		this.group = null;
		this.connectionIndex = null;
	}
}

Client.super_ = Events.EventEmitter;
Client.prototype = Object.create(Events.EventEmitter.prototype, {
	constructor: {
		value: Client,
		enumerable: false
	}
});