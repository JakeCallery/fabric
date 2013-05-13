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
        
        //Return constructor
        return InputViewManager;
    })();
});
