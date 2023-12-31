/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/events/GlobalEventBus',
'app/net/events/NetEvent',
'jac/utils/EventUtils',
'app/game/GameState',
'jac/logger/Logger',
'stats'],
function(EventDispatcher,ObjUtils,GEB,NetEvent, EventUtils, GameState, L, Stats){
    return (function(){
        /**
         * Creates a ViewManager object
         * @param {window} $window
         * @param {document} $doc
         * @param {navigator} $navigator
         * @param {GameState} $gameState
         * @extends {EventDispatcher}
         * @constructor
         */
        function ViewManager($window, $doc, $navigator, $gameState){
            //super
            EventDispatcher.call(this);

	        var self = this;
	        this.window = $window;
	        /** @type {document} */this.doc = $doc;
	        this.nav = $navigator;
	        this.gameState = $gameState;

	        this.stats = new Stats();
	        this.geb = new GEB();

	        this.animationFrameId = null;
	        this.statsAnimationFrameId = null;
	        this.updateStatsDelegate = EventUtils.bind(self, self.updateStats);

			this.geb.addHandler(NetEvent.CONNECTED, EventUtils.bind(self, self.handleConnected));
	        this.geb.addHandler(NetEvent.DISCONNECTED, EventUtils.bind(self, self.handleDisconnected));

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ViewManager,EventDispatcher);

	    ViewManager.prototype.updateStats = function(){
		    var self = this;
		    this.statsAnimationFrameId = this.window.requestAnimationFrame(self.updateStatsDelegate);
		    this.stats.update();
	    };


	    ViewManager.prototype.render = function(){
			//OVERRIDE ME
	    };

	    ViewManager.prototype.handleConnected = function($e){
		    L.log('VM Caught connect');
		    var clientPEl = this.doc.getElementById('clientNameP');
		    clientPEl.innerHTML = ('Client: ' + $e.data.id);
	    };

	    ViewManager.prototype.handleDisconnected = function($e){
		    L.log('VM Caught disconnect');
		    this.window.cancelAnimationFrame(this.animationFrameId);
		    //this.window.cancelAnimationFrame(this.statsAnimationFrameId);
	    };

        //Return constructor
        return ViewManager;
    })();
});
