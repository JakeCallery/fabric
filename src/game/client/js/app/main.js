/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'app/NetManager',
'app/ViewManager'],
function(L, ConsoleTarget, NetManager, ViewManager){
    return (function(){
	    L.addLogTarget(new ConsoleTarget());
	    L.log('New Main!');

		var nm = new NetManager();
	    var vm = new ViewManager(document, navigator);

	    nm.connect('testgroup1');

    })();
});
