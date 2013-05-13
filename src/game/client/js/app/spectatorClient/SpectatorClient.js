/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/BaseClient',
'jac/utils/ObjUtils'],
function(BaseClient,ObjUtils){
    return (function(){
        /**
         * Creates a SpectatorClient object
         * @extends {BaseClient}
         * @constructor
         */
        function SpectatorClient($win, $doc, $nav){
            //super
            BaseClient.call(this);

	        var win = $win;
	        var doc = $doc;
	        var nav = $nav;

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(SpectatorClient,BaseClient);
        
        //Return constructor
        return SpectatorClient;
    })();
});
