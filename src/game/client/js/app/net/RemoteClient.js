/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a RemoteClient object
         * @constructor
         */
        function RemoteClient($id){
	        this.id = $id;
        }
        
        
        //Return constructor
        return RemoteClient;
    })();
});
