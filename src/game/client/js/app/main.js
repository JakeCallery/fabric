/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget'],
function(L, ConsoleTarget){
    return (function(){
	    L.addLogTarget(new ConsoleTarget());
	    L.log('New Main!');
    })();
});
