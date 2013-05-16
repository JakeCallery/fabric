/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 5/7/13
 * Time: 1:09 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';
process.title = 'FabricGameServer';

var GameServer = require('./GameServer.js');

var gs = new GameServer('gameserver1');
gs.start(5252); //local server
//gs.start(80); //set for jitsu only