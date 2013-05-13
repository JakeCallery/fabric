/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a RemoteClient object
         * @param {string} $id GUID of client
         * @param {boolean} $isRemote false if local client, true if remote client
         * @param {string} $type client type (spectator, input, stats, etc...)
         * @constructor
         */
        function Client($id, $isRemote, $type){
	        this.id = $id;
	        this.isRemote = $isRemote;
	        this.type = $type;
        }
        
        //Return constructor
        return Client;
    })();
});
