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

				this.clients = [];

				this.geb = new GEB();
				this.vm = new StatsViewManager($win, $doc, $nav, gameState);
				this.nm = new NetManager(gameState);

				this.clientsTable = $doc.getElementById('clientsTable');

				this.geb.addHandler(NetEvent.CONNECTED, EventUtils.bind(self, self.handleConnected));
				this.geb.addHandler(NetEvent.ADDED_CLIENT, EventUtils.bind(self, self.handleAddedClient));
				this.geb.addHandler(NetEvent.REMOVED_CLIENT, EventUtils.bind(self, self.handleRemovedClient));

			}

			//Inherit / Extend
			ObjUtils.inheritPrototype(StatsClient,BaseClient);

			StatsClient.prototype.handleAddedClient = function($e){
				L.log('Stat client caught client added: ' + $e.data.id);
				var rowCount = this.clientsTable.rows.length;
				var row = this.clientsTable.insertRow(rowCount);
				var c0 = row.insertCell(0);
				c0.innerHTML = $e.data.id;
				var c1 = row.insertCell(1);
				c1.innerHTML = 'N/A';

			};

			StatsClient.prototype.handleRemovedClient = function($e){
				L.log('Stat client caught client removed: ' + $e.data);

				var row = null;

				for(var i = 0; i < this.clientsTable.rows.length; i++){
					if(this.clientsTable.rows[i].childNodes[0].innerHTML === $e.data.id){
						//remove
						this.clientsTable.deleteRow(i);
						break;
					}
				}

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
