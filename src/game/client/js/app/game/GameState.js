/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a GameState object
         * @constructor
         */
        function GameState(){
	        this.localPlayer = null;
	        this.remotePlayers = [];
	        this.allPlayersMap = {};
        }
        
        
        //Return constructor
        return GameState;
    })();
});
