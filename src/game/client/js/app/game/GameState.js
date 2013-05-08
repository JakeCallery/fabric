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
	        this.allPlayers = [];
        }
        
        
        //Return constructor
        return GameState;
    })();
});
