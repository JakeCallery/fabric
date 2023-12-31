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
'app/net/NetClient',
'app/net/events/NetEvent',
'app/game/GameState',
'app/net/MessageTypes',
'jac/utils/EventUtils'],
function(L, EventDispatcher,ObjUtils,GEB, JacEvent, NetClient, NetEvent, GameState, MessageTypes, EventUtils){
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

	        /** @const */ var THROTTLE_COUNT = 2;
			var updateCount = 0;

	        var gameState = $gameState;
	        var geb = new GEB();
	        //var connectURL = 'ws://192.168.1.96:5252'; //local url (no dns)
	        //var connectURL = 'ws://jachtml.com:5252'; //local url
	        var connectURL = 'ws://fabric-7776.onmodulus.net'; //modulus url
	        //var connectURL = 'ws://jac-fabric.nodejitsu.com:80'; //jitsu url
			var socket = null;
			var messageEvent = new NetEvent(NetEvent.MESSAGE);

	        //Stats
	        this.totalSentMessages = 0;
	        this.totalRecMessages = 0;
	        this.sentMessagesPerSec = 0;
	        this.recMessagesPerSec = 0;
			this.lastSendRateMessageCount = 0;
	        this.lastRecRateMessageCount = 0;
			this.statUpdateTimeoutId = -1;
			this.lastStatUpdateTime = 0;

	        var updateStatsDelegate = EventUtils.bind(self, updateStats);

	        //TODO: pool message objects
	        var msg = {};

	        /** @type {GameState} */
	        this.gameState = $gameState;

	        /** @type {array.<Client>} */
	        this.remoteClients = [];

	        /** @type {NetClient} */
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

		        self.addLocalClient($data.clientId, $data.clientType);

		        //add clients
		        for(var i = 0; i < $data.clients.length; i++){
			        if($data.clients[i].clientId !== self.localClient.id){
				        self.addRemoteClient($data.clients[i].clientId, $data.clients[i].clientType);
			        }
		        }

		        L.log('Num Remotes: ' + self.remoteClients.length);

		        //Start tracking message rates
		        updateStats();


	        };

	        var updateStats = function(){
		        if(self.lastStatUpdateTime !== 0){
			        var now = Date.now();
			        var timeDiff = now - self.lastStatUpdateTime;
			        var timeDiffInSec = timeDiff/1000;

			        if(self.lastSendRateMessageCount !== 0){
						var sendDiff = self.totalSentMessages - self.lastSendRateMessageCount;
				        self.sentMessagesPerSec = sendDiff / timeDiffInSec;

			        }

			        if(self.lastRecRateMessageCount !== 0){
				        var recDiff = self.totalRecMessages - self.lastRecRateMessageCount;
				        self.recMessagesPerSec = recDiff / timeDiffInSec;
			        }
		        }

		        self.lastStatUpdateTime = Date.now();
		        self.lastSendRateMessageCount = self.totalSentMessages;
		        self.lastRecRateMessageCount = self.totalRecMessages;
		        self.statUpdateTimeoutId = setTimeout(updateStats, 1000);

	        };

	        var handleSocketMessage = function($e){
		        self.totalRecMessages++;

		        var msg = JSON.parse($e.data);
		        var data = msg.data;

		        switch(msg.messageType){
			        case 'connect':
				        initialConnect(data);
				        L.log('ID: ' + self.localClient.id);
				        geb.dispatchEvent(new NetEvent(NetEvent.CONNECTED, self.localClient));
				        break;

			        case 'clientconnect':
				        L.log('Caught New Remote Client: ' + msg.senderId);
						self.addRemoteClient(msg.data.clientId, msg.data.clientType);
				        L.log('Num Remotes: ' + self.remoteClients.length);
				        break;

			        case 'clientdisconnect':
				        L.log('Caught Dropped Client: ' + data.clientId);
				        self.removeRemoteClient(data.clientId);
				        L.log('Num Remotes: ' + self.remoteClients.length);
				        break;

			        case MessageTypes.PING:
				        L.log('Caught Ping...', '@stats');
				        self.sendPong(msg);
				        break;

			        case MessageTypes.PONG:
				        L.log('Caught Pong...', '@stats');
				        geb.dispatchEvent(new NetEvent(NetEvent.STATS_MESSAGE, msg));
				        break;

			        case MessageTypes.GET_STATS:
				        L.log('Caught get stats..', '@stats');
				        //geb.dispatchEvent(new NetEvent(NetEvent.STATS_MESSAGE, msg));
				        self.sendStats(msg);
				        break;

			        case MessageTypes.NEW_STATS:
				        L.log('Caught new stats..', '@stats');
				        geb.dispatchEvent(new NetEvent(NetEvent.STATS_MESSAGE, msg));
				        break;

			        default:
				        if(msg.senderId != 0){
					        //TODO: decide if gameState needs to be here or not
					        if(gameState.allPlayersMap.hasOwnProperty(msg.senderId)){
						        gameState.allPlayersMap[msg.senderId].applyMessage(msg);
					        }

				        } else {
					        geb.dispatchEvent(new NetEvent(NetEvent.SERVER_MESSAGE, msg));
				        }
				        break;
		        }
	        };

	        this.update = function(){
		        if(updateCount >= THROTTLE_COUNT){
			        updateCount = -1;

			        //TODO: Separate this out, maybe override this for the spectator client?
			        //Check because spectator client does not have a local player, they are all remote players
			        if(gameState.localPlayer !== null){
				        msg = {};
				        msg.senderId = gameState.localPlayer.id;
				        msg.messageType = 'clientupdate';
				        msg.type = 'utf8';
				        msg.data = {};
				        msg.data.targetX = this.gameState.localPlayer.targetX;
				        msg.data.targetY = this.gameState.localPlayer.targetY;
				        socket.send(JSON.stringify(msg));
				        this.totalSentMessages++;
			        }

		        }

		        updateCount++;

	        };

	        this.sendPong = function($msg){
		        this.sendMsgToClient($msg.senderId, MessageTypes.PONG, $msg.data);
	        };

	        this.pingClient = function($clientId){
		        this.sendMsgToClient($clientId, MessageTypes.PING, {timestamp:Date.now()});
	        };

	        this.sendStats = function($msg){
				var data = {};
		        //add total messages sent, total messages received, send rate, rec rate
		        data.totalSent = this.totalSentMessages;
		        data.totalRec = this.totalRecMessages;
		        data.sendRate = this.sentMessagesPerSec;
		        data.recRate = this.recMessagesPerSec;
		        this.sendMsgToClient($msg.senderId, MessageTypes.NEW_STATS, data);
	        };

	        this.getStatsFromClient = function($clientId){
		        L.log('Request Stats From Client', '@stats');
		        this.sendMsgToClient($clientId, MessageTypes.GET_STATS, {});
	        };

	        this.sendMsgToClient = function($targetClientId, $msgType, $data){
		        msg = {};
		        msg.senderId = self.localClient.id;
		        msg.recId = $targetClientId;
		        msg.messageType = $msgType;
		        msg.type = 'utf8';
		        msg.data = {};

		        //Copy data
		        for(var prop in $data){
			        if($data.hasOwnProperty(prop)){
				        msg.data[prop] = $data[prop];
			        }
		        }

				socket.send(JSON.stringify(msg));
		        this.totalSentMessages++;

	        };

	        this.addLocalClient = function($clientId, $clientType){
		        var c = new NetClient($clientId, false, $clientType);
		        self.localClient = c;
		        geb.dispatchEvent(new NetEvent(NetEvent.ADDED_CLIENT, c));
	        };

	        this.addRemoteClient = function($clientId, $clientType){
		        var c = new NetClient($clientId, true, $clientType);
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

	        this.connect = function($groupName, $clientType){
		        L.log('Trying to connect to: ' + connectURL);
				socket = new WebSocket(connectURL + '?group=' + $groupName + '&type=' + $clientType, 'ingame-protocol');
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
