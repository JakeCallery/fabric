/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/events/EventDispatcher','jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a BaseClient object
         * @extends {EventDispatcher}
         * @constructor
         */
        function BaseClient(){
            //super
            EventDispatcher.call(this);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(BaseClient,EventDispatcher);

	    BaseClient.SPECTATOR_TYPE = 'spectator';
	    BaseClient.INPUT_TYPE = 'input';
	    BaseClient.STATS_TYPE = 'stats';

	    BaseClient.prototype.update = function(){
		    //OVERRIDE ME
	    };

        //Return constructor
        return BaseClient;
    })();
});
