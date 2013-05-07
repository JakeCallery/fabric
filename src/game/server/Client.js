/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 5/6/13
 * Time: 12:20 PM
 * To change this template use File | Settings | File Templates.
 */
function Client($connection) {
	this.connection = $connection
	this.groupId = null;
}

module.exports = Client;