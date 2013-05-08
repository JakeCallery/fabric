/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/events/GlobalEventBus'],
function(EventDispatcher,ObjUtils, GEB){
    return (function(){
        /**
         * Creates a Game object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Game($gameState){
            //super
            EventDispatcher.call(this);

	        this.geb = new GEB();
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Game,EventDispatcher);
        
        //Return constructor
        return Game;
    })();
});
