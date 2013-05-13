/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/BaseClient',
'jac/utils/ObjUtils',
'app/game/GameState',
'app/net/events/NetEvent',
'jac/utils/EventUtils',
'app/inputClient/InputManager',
'app/ViewManager',
'app/net/NetManager',
'app/game/Game',
'jac/events/GlobalEventBus',
'jac/logger/Logger'],
function(BaseClient,ObjUtils, GameState, NetEvent,
         EventUtils, InputManager, ViewManager, NetManager,
         Game, GEB, L){
    return (function(){
        /**
         * Creates a InputClient object
         * @extends {BaseClient}
         * @constructor
         */
        function InputClient($win, $doc, $nav){
            //super
            BaseClient.call(this);

	        var self = this;

	        var gameState = new GameState();

	        var geb = new GEB();
	        this.im = new InputManager($doc.getElementById('gameCanvas'),gameState);
	        this.vm = new ViewManager($win, $doc, $nav, gameState);
	        this.nm = new NetManager(gameState);
	        this.game = new Game(gameState, $win, this.vm, this.nm);

	        geb.addHandler(NetEvent.CONNECTED, EventUtils.bind(self, self.handleConnected));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(InputClient,BaseClient);

	    InputClient.prototype.connect = function($groupId){
		    this.nm.connect($groupId, 'input');
	    };

	    InputClient.prototype.handleConnected = function($e){
		    L.log('InputClient caught connected');
		    this.game.start();
	    };

        //Return constructor
        return InputClient;
    })();
});
