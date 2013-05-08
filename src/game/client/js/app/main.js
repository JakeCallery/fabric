/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

//TODO: NEXT
/**
 * When a new client connects, send back the already connected clients
 */

define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'app/net/NetManager',
'app/ViewManager',
'json2'],
function(L, ConsoleTarget, NetManager, ViewManager, JSON){
    return (function(){
	    L.addLogTarget(new ConsoleTarget());
	    L.log('New Main!');

		var nm = new NetManager();
	    var vm = new ViewManager(document, navigator);

	    nm.connect('testgroup1');

    })();
});
