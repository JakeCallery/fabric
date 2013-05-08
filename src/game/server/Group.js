/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 5/6/13
 * Time: 12:07 PM
 * To change this template use File | Settings | File Templates.
 */
var Events = require('events');

module.exports = Group;

function Group($id) {
	//super
	Events.EventEmitter.call(this);

	var self = this;

	this.id = $id;
	this.clients = [];

	this.addClient = function($client){
		self.clients.push($client);
		$client.group = self;

		//Wait for close, and clean up client if needed
		$client.addListener('close', handleClientClose);
	};

	this.removeClient = function($client){
		var index = this.clients.indexOf($client);
		self.clients.splice(index,1);
		$client.removeListener('close', handleClientClose);
	};

	var handleClientClose = function($client, $reasonCode, $description){
		console.log('Group caught client close: ' + self.clients.length);
		var idx = self.clients.indexOf($client);
		if(idx !== -1){
			self.clients.splice(idx, 1);
			console.log('Num Clients: ' + self.clients.length);
		} else {
			console.log('Client not found in group :(');
		}

		$client.removeListener('close', handleClientClose);
		$client.destroy();

		if(self.clients.length <= 0){
			self.emit('emptyGroup',self);
		}
	};

	this.sendToGroupFromClient = function($message, $client){
		for(var i = 0, l=this.clients.length; i < l; i++){
			var c = this.clients[i];
			if(c !== $client){
				c.sendMessage($message);
			}
		}
	};

	this.sendToAll = function($message){
		for(var i = 0, l = this.clients.length; i < l; i++){
			var c = this.clients[i];
			c.sendMessage($message);
		}
	};
}

Group.super_ = Events.EventEmitter;
Group.prototype = Object.create(Events.EventEmitter.prototype, {
	constructor: {
		value: Group,
		enumerable: false
	}
});



