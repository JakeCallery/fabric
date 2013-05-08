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
'app/net/events/NetEvent',
'app/game/GameState'],
function(L, EventDispatcher,ObjUtils,GEB, JacEvent, Client, NetEvent, GameState){
    return (function(){
        /**
         * Creates a NetManager object
         * @param {GameState} $gameState
         * @extends {EventDispatcher}
         * @constructor
         */
        function NetManager($gameState){
            //super
            EventDispatcher.call(this);

	        var self = this;

	        var geb = new GEB();
	        var connectURL = 'ws://jachtml.com:5252';
			var socket = null;
			var messageEvent = new NetEvent(NetEvent.MESSAGE);

	        /** @type {GameState} */
	        this.gameState = $gameState;

	        /** @type {array.<Client>} */
	        this.remoteClients = [];

	        /** @type {Client} */
	        this.localClient = null;

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

		        self.addLocalClient($data.clientId);

		        //add clients
		        for(var i = 0; i < $data.clients.length; i++){
			        if($data.clients[i].id !== self.localClient.id){
				        self.addRemoteClient($data.clients[i].id);
			        }
		        }

		        L.log('Num Remotes: ' + self.remoteClients.length);

	        };

	        var handleSocketMessage = function($e){
		        L.log('Message: ' + $e.data);

		        var msg = JSON.parse($e.data);
		        var data = msg.data;

		        switch(msg.messageType){
			        case 'connect':
				        initialConnect(data);
				        L.log('ID: ' + self.localClient.id);
				        geb.dispatchEvent(new NetEvent(NetEvent.CONNECTED));
				        break;

			        case 'clientconnect':
				        L.log('Caught New Remote Client: ' + msg.senderId);
						self.addRemoteClient(msg.senderId);
				        L.log('Num Remotes: ' + self.remoteClients.length);
				        break;

			        case 'clientdisconnect':
				        L.log('Caught Dropped Client: ' + data.clientId);
				        self.removeRemoteClient(data.clientId);
				        L.log('Num Remotes: ' + self.remoteClients.length);
				        break;

			        default:
				        if(msg.senderId != 0){
							gameState.allPlayers[msg.senderId].applyMessage(msg);
				        } else {
					        geb.dispatchEvent(new NetEvent(NetEvent.SERVER_MESSAGE, msg));
				        }
				        break;
		        }

	        };

	        this.addLocalClient = function($clientId){
		        var c = new Client($clientId, false);
		        self.localClient = c;
		        geb.dispatchEvent(new NetEvent(NetEvent.ADDED_CLIENT, c));
	        };

	        this.addRemoteClient = function($clientId){
		        var c = new Client($clientId, true);
		        self.remoteClients.push(c);
		        geb.dispatchEvent(new NetEvent(NetEvent.ADDED_CLIENT, c));
		        L.log('notify of added client');
	        };

	        this.removeRemoteClient = function($clientId){
		        for(var i = 0; i < self.remoteClients.length; i++){
			        if(self.remoteClients[i].id === $clientId){
				        var c = self.remoteClients[i];
				        self.remoteClients.splice(i,1);
				        geb.dispatchEvent(new NetEvent(NetEvent.REMOVED_CLIENT,c));
				        L.log('notify of removed client');
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
