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

	this.id = $id;
	this.clients = [];

	this.addClient = function($client){
		var self = this;
		this.clients.push($client);
		$client.groupId = this.id;

		//Wait for close, and clean up client if needed
		$client.connection.on('close', function(reasonCode, description){
			console.log('Group caught client close: ' + self.clients.length);
			var idx = self.clients.indexOf($client);
			if(idx !== -1){
				self.clients.splice(idx, 1);
				console.log('Num Clients: ' + self.clients.length);
			} else {
				console.log('Client not found in group :(');
			}

			if(self.clients.length <= 0){
				self.emit('emptyGroup');
			}
		});

	};

	this.removeClient = function($client){
		var index = this.clients.indexOf($client);
		this.clients.splice(index,1);
	};
}

Group.super_ = Events.EventEmitter;
Group.prototype = Object.create(Events.EventEmitter.prototype, {
	constructor: {
		value: Group,
		enumerable: false
	}
});



