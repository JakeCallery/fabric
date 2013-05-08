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

        //Return constructor
        return NetEvent;
    })();
});
