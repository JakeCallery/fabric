/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/events/EventDispatcher','jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a Player object
         * @extends {EventDispatcher}
         * @constructor
         */
        function Player(){
            //super
            EventDispatcher.call(this);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(Player,EventDispatcher);
        
        //Return constructor
        return Player;
    })();
});
