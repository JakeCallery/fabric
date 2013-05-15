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

        //Return constructor
        return MessageTypes;
    })();
});
