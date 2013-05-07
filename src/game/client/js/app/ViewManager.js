/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/events/GlobalEventBus'],
function(EventDispatcher,ObjUtils,GEB){
    return (function(){
        /**
         * Creates a ViewManager object
         * @param {document} $doc
         * @param {navigator} $navigator
         * @extends {EventDispatcher}
         * @constructor
         */
        function ViewManager($doc, $navigator){
            //super
            EventDispatcher.call(this);

	        this.doc = $doc;
	        this.nav = $navigator;
	        this.geb = new GEB();



        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(ViewManager,EventDispatcher);
        
        //Return constructor
        return ViewManager;
    })();
});
