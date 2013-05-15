/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        MessageTypes = {};
	    MessageTypes.PING = 'ping';
	    MessageTypes.PONG = 'pong';
		MessageTypes.NEW_STATS = 'newstats';
	    MessageTypes.GET_STATS = 'getstats';
        //Return constructor
        return MessageTypes;
    })();
});
