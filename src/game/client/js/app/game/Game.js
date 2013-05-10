/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/events/GlobalEventBus',
'app/game/GameState',
'app/game/Player',
'app/net/events/NetEvent',
'jac/utils/EventUtils',
'jac/logger/Logger',
'app/net/NetManager'],
function(EventDispatcher,ObjUtils, GEB, GameState, Player, NetEvent, EventUtils, L, NetManager){
    return (function(){
        /**
         * Creates a Game object
         * @param {GameState} $gameState
         * @param {window} $window
         * @param {ViewManager} $viewManager
         * @param {NetManager} $netManager
         * @extends {EventDispatcher}
         * @constructor
         */
        function Game($gameState, $window, $viewManager, $netManager){
            //super
            EventDispatcher.call(this);
	        var self = this;

	        this.geb = new GEB();
	        this.gameState = $gameState;
			this.window = $window;

	        this.animationFrameId = null;
	        this.updateDelegate = EventUtils.bind(self, self.update);

	        this.viewManager = $viewManager;
			this.netManager = $netManager;

			this.geb.addHandler(NetEvent.ADDED_CLIENT, EventUtils.bind(self, self.handleAddedClient));
			this.geb.addHandler(NetEvent.REMOVED_CLIENT, EventUtils.bind(self, self.handleRemovedClient));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Game,EventDispatcher);

		Game.prototype.start = function(){
			this.update();
	    };

	    Game.prototype.update = function(){
		    var self = this;
		    this.animationFrameId = this.window.requestAnimationFrame(self.updateDelegate);

		    L.log('Game Update', '@gameUpdate');

		    this.gameState.localPlayer.targetX = this.gameState.primaryX;
		    this.gameState.localPlayer.targetY = this.gameState.primaryY;

			this.viewManager.render();

		    this.netManager.update();

	    };

	    Game.prototype.handleAddedClient = function($e){
		    L.log('Game caught added client', '@game');
		    this.makePlayer($e.data);
	    };

	    Game.prototype.handleRemovedClient = function($e){
		    L.log('Game caught removed client', '@game');
		    this.removePlayer($e.data);
	    };

	    Game.prototype.makePlayer = function($client){

		    /** @type {Player} */ var p = new Player($client);

		    if(p.isLocalPlayer === true){
			    this.gameState.localPlayer = p;
			    this.gameState.localPlayer.color = '#FF0000';
			    L.log('set player as local', '@game');
		    } else {
			    this.gameState.remotePlayers.push(p);
			    L.log('added player to remote players: ' + this.gameState.remotePlayers.length, '@game');
		    }

		    this.gameState.allPlayersMap[p.id] = p;
		    L.log('added player to allPlayers: ' + ObjUtils.countProps(this.gameState.allPlayersMap, '@game'));
	    };

	    Game.prototype.removePlayer = function($player){
			if($player.isLocalPlayer === true){
				L.log('Removing Local Player');
				this.gameState.localPlayer = null;
			} else {
				var rIdx = this.gameState.remotePlayers.indexOf($player);
				if(rIdx != -1){
					this.gameState.remotePlayers.splice(rIdx,1);
				}
			}

		    if(this.gameState.allPlayersMap.hasOwnProperty($player.id)){
			    delete(this.gameState.allPlayersMap[$player.id]);
		    }
	    };

        //Return constructor
        return Game;
    })();
});
