/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/ViewManager',
'jac/utils/ObjUtils'],
function(ViewManager,ObjUtils){
    return (function(){
        /**
         * Creates a SpectatorViewManager object
         * @extends {ViewManager}
         * @constructor
         */
        function SpectatorViewManager(){
            //super
            ViewManager.call(this);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(SpectatorViewManager,ViewManager);
        
        //Return constructor
        return SpectatorViewManager;
    })();
});
