/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/JacEvent',
'jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){
        /**
         * Creates a NetEvent object
         * @param {string} $type
         * @param {object} [$data]
         * @extends {JacEvent}
         * @constructor
         */
        function NetEvent($type, $data){
            //super
            JacEvent.call(this, $type, $data);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(NetEvent,JacEvent);

	    /** @const */ NetEvent.CONNECTED = 'netConnectedEvent';
	    /** @const */ NetEvent.DISCONNECTED = 'netDisconnectedEvent';
	    /** @const */ NetEvent.REMOVED_CLIENT = 'netRemovedClientEvent';
	    /** @const */ NetEvent.ADDED_CLIENT = 'netAddedClientEvent';
	    /** @const */ NetEvent.MESSAGE = 'netMessageEvent';
	    /** @const */ NetEvent.SERVER_MESSAGE = 'netServerMessageEvent';
	    /** @const */ NetEvent.STATS_MESSAGE = 'netStatsMessageEvent';

        //Return constructor
        return NetEvent;
    })();
});
