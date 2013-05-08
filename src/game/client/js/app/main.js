/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

//TODO: NEXT
/**
 *
 */

define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'app/net/NetManager',
'app/ViewManager',
'json2',
'jac/polyfills/RequestAnimationFrame',
'app/game/GameState',
'app/game/Game'],
function(L, ConsoleTarget, NetManager, ViewManager, JSON, RequestAnimationFrame, GameState, Game){
    return (function(){
	    L.addLogTarget(new ConsoleTarget());
	    L.log('New Main!');

	    var gameState = new GameState();
		var game = new Game(gameState);
	    var nm = new NetManager();
	    var vm = new ViewManager(window, document, navigator, gameState);

	    //Tmp hard connect to testgroup1 for now
	    //TODO: proper group connection based on url params
	    nm.connect('testgroup1');

    })();
});
