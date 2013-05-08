/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/logger/Logger',
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/events/GlobalEventBus',
'jac/events/JacEvent',
'app/net/Client',
'app/net/events/NetEvent'],
function(L, EventDispatcher,ObjUtils,GEB, JacEvent, Client, NetEvent){
    return (function(){
        /**
         * Creates a NetManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function NetManager(){
            //super
            EventDispatcher.call(this);

	        var self = this;

	        var geb = new GEB();
	        var connectURL = 'ws://jachtml.com:5252';
			var socket = null;

	        this.clientId = null;
	        this.remoteClients = [];

	        var handleSocketOpen = function($e){
		        L.log('Connected...');
	        };

	        var handleSocketError = function($e){
		        L.log('Socket Error: ' + $e);
	        };

	        var handleSocketClose = function($e){
		        L.log('Socket Closed');
		        geb.dispatchEvent(new NetEvent(NetEvent.DISCONNECTED));
	        };

	        var initialConnect = function($data){
		        L.log('Caught Initial Connect');

		        self.clientId = $data.clientId;

		        //add remotes
		        for(var i = 0; i < $data.remotes.length; i++){
			        if($data.remotes[i].id !== self.clientId){
				        self.addRemoteClient($data.remotes[i].id);
			        }
		        }

		        L.log('Num Remotes: ' + self.remoteClients.length);

	        };

	        var handleSocketMessage = function($e){
		        L.log('Message: ' + $e.data);

		        var msg = JSON.parse($e.data);
		        var data = null;

		        if(msg.hasOwnProperty('data')){
			        data = JSON.parse(msg.data);
		        }

		        switch(msg.messageType){
			        case 'connect':
				        initialConnect(data);
				        L.log('ID: ' + self.clientId);
				        geb.dispatchEvent(new NetEvent(NetEvent.CONNECTED));
				        break;

			        case 'newclient':
				        L.log('Caught New Remote Client: ' + msg.senderId);
						self.addRemoteClient(msg.senderId);
				        L.log('Num Remotes: ' + self.remoteClients.length);
				        break;

			        case 'remotedisconnect':
				        L.log('Caught Dropped Client: ' + data.clientId);
				        self.removeRemoteClient(data.clientId);
				        L.log('Num Remotes: ' + self.remoteClients.length);
				        break;

			        default:
				        geb.dispatchEvent(new JacEvent('message', $e.data));
				        break;
		        }

	        };

	        this.addRemoteClient = function($clientId){
		        self.remoteClients.push(new Client($clientId));
	        };

	        this.removeRemoteClient = function($clientId){
		        for(var i = 0; i < self.remoteClients.length; i++){
			        if(self.remoteClients[i].id === $clientId){
				        self.remoteClients.splice(i,1);
				        break;
			        }
		        }
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
