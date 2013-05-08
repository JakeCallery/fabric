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
'jac/logger/Logger'],
function(EventDispatcher,ObjUtils, GEB, GameState, Player, NetEvent, EventUtils, L){
    return (function(){
        /**
         * Creates a Game object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Game($gameState){
            //super
            EventDispatcher.call(this);
	        this.geb = new GEB();
	        this.gameState = $gameState;

	        var self = this;
			this.geb.addHandler(NetEvent.ADDED_CLIENT, EventUtils.bind(self, self.handleAddedClient));
			this.geb.addHandler(NetEvent.REMOVED_CLIENT, EventUtils.bind(self, self.handleRemovedClient));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Game,EventDispatcher);

	    Game.prototype.handleAddedClient = function($e){
		    L.log('Game caught added client');
		    this.makePlayer($e.data);
	    };

	    Game.prototype.handleRemovedClient = function($e){
		    L.log('Game caught removed client');
		    this.removePlayer($e.data);
	    };

	    Game.prototype.makePlayer = function($client){

		    /** @type {Player} */ var p = new Player($client);

		    if(p.isLocalPlayer === true){
			    this.gameState.localPlayer = p;
			    L.log('set player as local');
		    } else {
			    this.gameState.remotePlayers.push(p);
			    L.log('added player to remote players: ' + this.gameState.remotePlayers.length);
		    }

		    this.gameState.allPlayersMap[p.id] = p;
		    L.log('added player to allPlayers: ' + ObjUtils.countProps(this.gameState.allPlayersMap));
	    };

	    Game.prototype.removePlayer = function($player){
			if($player.isLocalPlayer === true){
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
