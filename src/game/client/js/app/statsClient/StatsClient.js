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
	function(BaseClient,ObjUtils, SpectatorViewManager, NetManager,
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

				var self = this;
				var gameState = new GameState();

				var win = $win;
				var doc = $doc;
				var nav = $nav;

				var geb = new GEB();
				this.vm = new SpectatorViewManager($win, $doc, $nav, gameState);
				this.nm = new NetManager(gameState);
				this.game = new Game(gameState, $win, this.vm, this.nm);

				geb.addHandler(NetEvent.CONNECTED, EventUtils.bind(self, self.handleConnected));

			}

			//Inherit / Extend
			ObjUtils.inheritPrototype(StatsClient,BaseClient);

			StatsClient.prototype.connect = function($groupId){
				this.nm.connect($groupId, 'stats');
			};

			StatsClient.prototype.handleConnected = function($e){
				L.log('Spectator Client caught connected');
				this.game.start();
			};

			//Return constructor
			return StatsClient;
		})();
	});
