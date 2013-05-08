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
         * @constructor
         */
        function RemoteClient($id, $isRemote){
	        this.id = $id;
	        this.isRemote = $isRemote
        }
        
        
        //Return constructor
        return RemoteClient;
    })();
});
