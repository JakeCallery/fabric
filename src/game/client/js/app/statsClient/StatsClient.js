/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
	'app/BaseClient',
	'jac/utils/ObjUtils',
	'app/statsClient/StatsViewManager',
	'app/net/NetManager',
	'app/game/Game',
	'jac/events/GlobalEventBus',
	'jac/utils/EventUtils',
	'app/game/GameState',
	'app/net/events/NetEvent',
	'jac/logger/Logger'],
	function(BaseClient,ObjUtils, StatsViewManager, NetManager,
	         Game, GEB, EventUtils, GameState, NetEvent, L){
		return (function(){
			/**
			 * Creates a StatsClient object
			 * @extends {BaseClient}
			 * @constructor
			 */
			function StatsClient($win, $doc, $nav){
				//super
				BaseClient.call(this);

				L.log('Making new Stats Client');

				var self = this;
				var gameState = new GameState();

				var win = $win;
				var doc = $doc;
				var nav = $nav;

				this.timeoutId = -1;

				this.clients = [];

				this.geb = new GEB();
				this.vm = new StatsViewManager($win, $doc, $nav, gameState);
				this.nm = new NetManager(gameState);

				this.geb.addHandler(NetEvent.CONNECTED, EventUtils.bind(self, self.handleConnected));
				this.geb.addHandler(NetEvent.ADDED_CLIENT, EventUtils.bind(self, self.handleAddedClient));
				this.geb.addHandler(NetEvent.REMOVED_CLIENT, EventUtils.bind(self, self.handleRemovedClient));

				this.geb.addHandler(NetEvent.STATS_MESSAGE, EventUtils.bind(self, self.handleStatsMessage));

				this.vm.addHandler('stopupdate', EventUtils.bind(self, self.stopUpdate));

				//Start updating
				this.update();

			}

			//Inherit / Extend
			ObjUtils.inheritPrototype(StatsClient,BaseClient);

			StatsClient.prototype.handleStatsMessage = function($e){
				L.log('Caught Stats Message: ' + $e.data.messageType);
				if($e.data.messageType === MessageTypes.PONG){
					this.updateClientPong($e.data);
				}
			};

			StatsClient.prototype.updateClientPong = function($msg){

				//measure roundtrip
				var time = Date.now();
				var diff = time - $msg.data.timestamp;
				console.log('Ping Time: ' + diff);

				var idx = this.getClientIndexById($msg.senderId);
				if(idx != -1){

					var c = this.clients[idx];
					if(c.statsData.numPings > 10){
						c.statsData.numPings = 0;
						c.statsData.pingTotal = 0;
					}

					//update ping stats
					c.statsData.numPings++;
					c.statsData.pingTotal += diff;
					c.statsData.lastPing = diff;
					var avg = Math.round(c.statsData.pingTotal / c.statsData.numPings);
					this.vm.updatePing(idx,avg);

				}
			};

			StatsClient.prototype.stopUpdate = function(){
				L.log('Stopping Update');
				clearTimeout(this.timeoutId);
			};

			StatsClient.prototype.update = function(){
				var self = this;

				for(var i = 0; i < this.clients.length; i++){
					if(this.clients[i].id !== this.nm.localClient.id){
						L.log('Sending Ping to: ' + this.clients[i].id);
						this.nm.pingClient(this.clients[i].id);
					}

				}

				this.timeoutId = setTimeout(EventUtils.bind(self, self.update), 1000);
			};

			StatsClient.prototype.handleAddedClient = function($e){

				var client = $e.data;
				client.statsData.numPings = 0;
				client.statsData.lastPing = 0;
				client.statsData.pingTotal = 0;

				L.log('Stat client caught client added: ' + client.id);
				this.clients.push(client);

				this.vm.addClient(client);

			};

			StatsClient.prototype.handleRemovedClient = function($e){
				L.log('Stat client caught client removed: ' + $e.data);

				var row = null;

				this.vm.removeClient($e.data);

				//remove from list
				var idx = this.getClientIndexById($e.data.id);
				if(idx !== -1){
					this.clients.splice(idx,1);
				}

			};

			StatsClient.prototype.getClientIndexById = function($clientId){
				for(var i = 0; i < this.clients.length; i++){
					if(this.clients[i].id === $clientId){
						return i;
					}
				}

				return -1;
			};

			StatsClient.prototype.connect = function($groupId){
				L.log('Stats Connect');
				this.nm.connect($groupId, 'stats');
			};

			StatsClient.prototype.handleConnected = function($e){
				L.log('Stats Client caught connected');
			};

			//Return constructor
			return StatsClient;
		})();
	});
