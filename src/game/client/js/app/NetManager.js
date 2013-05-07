/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/logger/Logger',
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/events/GlobalEventBus'],
function(L, EventDispatcher,ObjUtils,GEB){
    return (function(){
        /**
         * Creates a NetManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function NetManager(){
            //super
            EventDispatcher.call(this);

	        var geb = new GEB();
	        var connectURL = 'ws://jachtml.com:5252';
			var socket = null;

	        var handleSocketOpen = function($e){
		        L.log('Connected...');
	        };

	        var handleSocketError = function($e){
		        L.log('Socket Error: ' + $e);
	        };

	        var handleSocketClose = function($e){
		        L.log('Socket Closed');
	        };

	        var handleSocketMessage = function($e){
		        L.log('Message: ' + $e.data);
		        geb.dispatchEvent(new JacEvent('message', $e.data));
	        };

	        this.connect = function($groupName){
				socket = new WebSocket(connectURL + '?group=' + $groupName, 'ingame-protocol');
		        socket.addEventListener('open', handleSocketOpen);
		        socket.addEventListener('close', handleSocketClose);
		        socket.addEventListener('error', handleSocketError);
		        socket.addEventListener('message', handleSocketMessage);
	        };

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(NetManager,EventDispatcher);

        //Return constructor
        return NetManager;
    })();
});
