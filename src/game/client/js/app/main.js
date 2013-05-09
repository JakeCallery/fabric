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
	    L.addTag('@mouse');
	    L.addTag('@touch');
	    L.addTag('@game');
	    //L.addTag('@vmrender');
	    //L.addTag('@gameUpdate');
	    L.isTagFilterEnabled = true;
	    L.isShowingUnTagged = true;

	    var gameState = new GameState();
	    var im = new InputManager(doc.getElementById('gameCanvas'),gameState);
	    var vm = new ViewManager(window, doc, navigator, gameState);
		var game = new Game(gameState, window, vm);
	    var nm = new NetManager();

	    //Tmp hard connect to testgroup1 for now
	    //TODO: proper group connection based on url params
	    nm.connect('testgroup1');

	    //TODO: Wait for connect before starting
	    game.start();

    })();
});
