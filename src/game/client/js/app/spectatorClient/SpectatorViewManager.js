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
        function SpectatorViewManager($window, $doc, $navigator, $gameState){
            //super
            ViewManager.call(this, $window, $doc, $navigator, $gameState);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(SpectatorViewManager,ViewManager);
        
        //Return constructor
        return SpectatorViewManager;
    })();
});
