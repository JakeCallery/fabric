/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'app/net/Client'],
function(EventDispatcher,ObjUtils, Client){
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
			this.isLocalPlayer = !this.client.isRemote;
	        this.currentX = 0;
	        this.currentY = 0;
	        this.targetX = 0;
	        this.targetY = 0;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Player,EventDispatcher);
        
        //Return constructor
        return Player;
    })();
});
