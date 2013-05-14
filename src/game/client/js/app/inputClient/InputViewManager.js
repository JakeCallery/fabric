/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/ViewManager',
'jac/utils/ObjUtils',
'jac/logger/Logger'],
function(ViewManager,ObjUtils,L){
    return (function(){
        /**
         * Creates a InputViewManager object
         * @extends {ViewManager}
         * @constructor
         */
        function InputViewManager($win, $doc, $nav, $gameState){
            //super
            ViewManager.call(this, $win, $doc, $nav, $gameState);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(InputViewManager,ViewManager);

	    InputViewManager.prototype.render = function(){
		    var self = this;

		    //Clear //TODO: maybe use dirty rects, or some smarter clearing
		    this.gameCtx.fillStyle = '#000000';
		    this.gameCtx.fillRect(0,0,600,600);

		    //TODO: optimize this loop, I'm sure it blows...
		    var p;
		    for(var id in this.gameState.allPlayersMap){
			    if(this.gameState.allPlayersMap.hasOwnProperty(id)){
				    p = this.gameState.allPlayersMap[id];
			    }

			    this.gameCtx.beginPath();
			    this.gameCtx.arc(p.targetX, p.targetY, 20,0,2*Math.PI, false);
			    this.gameCtx.fillStyle = p.color;
			    this.gameCtx.fill();
		    }
	    };

        //Return constructor
        return InputViewManager;
    })();
});
