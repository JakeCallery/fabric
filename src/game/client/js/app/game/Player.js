/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/net/Client',
'jac/logger/Logger'],
function(EventDispatcher,ObjUtils, Client, L){
    return (function(){
        /**
         * Creates a Player object
         * @param {Client} $client
         * @extends {EventDispatcher}
         * @constructor
         */
        function Player($client){
            //super
            EventDispatcher.call(this);

	        /** @type {Client} */ this.client = $client;
	        this.id = this.client.id;
			this.isLocalPlayer = !this.client.isRemote;
	        this.color = '#00FF00';
	        this.currentX = 0;
	        this.currentY = 0;
	        this.targetX = 0;
	        this.targetY = 0;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Player,EventDispatcher);

	    Player.prototype.applyMessage = function($msgObj){
		    L.log('Player Message: ' + $msgObj.data);
	    };

        //Return constructor
        return Player;
    })();
});
