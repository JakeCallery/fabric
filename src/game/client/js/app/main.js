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
'json2',
'jac/polyfills/RequestAnimationFrame',
'jac/events/GlobalEventBus',
'jac/utils/BrowserUtils',
'app/inputClient/InputClient',
'app/spectatorClient/SpectatorClient',
'app/BaseClient',
'app/statsClient/StatsClient'],
function(doc, L, ConsoleTarget, JSON, RequestAnimationFrame,
         GEB, BrowserUtils, InputClient, SpectatorClient, BaseClient,
		 StatsClient){
    return (function(){
	    L.addLogTarget(new ConsoleTarget());
	    L.log('New Main!');
	    //L.addTag('@mouse');
	    L.addTag('@touch');
	    L.addTag('@game');
	    L.addTag('@net');
	    //L.addTag('@vmrender');
	    //L.addTag('@gameUpdate');
	    L.isTagFilterEnabled = true;
	    L.isShowingUnTagged = true;
	    L.isEnabled = true;

	    var client = null;

	    //Get client type
		var urlParams = BrowserUtils.getURLParams(window);
		if(urlParams.hasOwnProperty('clientType')){
			if(urlParams.clientType === BaseClient.INPUT_TYPE){
				//set up new input client
				client = new InputClient(window, doc, window.navigator);
			} else if(urlParams.clientType === BaseClient.SPECTATOR_TYPE){
				//set up new spectator client
				client = new SpectatorClient(window, doc, window.navigator);
			} else if(urlParams.clientType === BaseClient.STATS_TYPE){
				//set up new stats client
				client = new StatsClient(window, doc, window.navigator);
			} else {
				//unsupported client
				L.error('Unsupported client: ' + urlParams.clientType, true);
			}
		}

	    if(client !== null){
		    //connect
		    client.connect('testgroup1');
	    }

    })();
});
