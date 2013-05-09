/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

//TODO: NEXT
/**
 *
 */

define([
'libs/domReady!',
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'app/net/NetManager',
'app/ViewManager',
'json2',
'jac/polyfills/RequestAnimationFrame',
'app/game/GameState',
'app/game/Game',
'app/InputManager'],
function(doc, L, ConsoleTarget, NetManager, ViewManager, JSON, RequestAnimationFrame, GameState, Game, InputManager){
    return (function(){
	    L.addLogTarget(new ConsoleTarget());
	    L.log('New Main!');

	    var im = new InputManager(doc.getElementById('gameCanvas'));
	    var gameState = new GameState();
		var game = new Game(gameState);
	    var nm = new NetManager();
	    var vm = new ViewManager(window, doc, navigator, gameState);

	    //Tmp hard connect to testgroup1 for now
	    //TODO: proper group connection based on url params
	    nm.connect('testgroup1');

    })();
});
