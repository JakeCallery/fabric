/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/events/EventDispatcher','jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a StatsManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function StatsManager(){
            //super
            EventDispatcher.call(this);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(StatsManager,EventDispatcher);
        
        //Return constructor
        return StatsManager;
    })();
});
