/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'app/ViewManager',
'jac/utils/ObjUtils',
'jac/logger/Logger',
'jac/utils/EventUtils',
'jac/events/JacEvent'],
	function(ViewManager,ObjUtils,L, EventUtils, JacEvent){
		return (function(){
			/**
			 * Creates a StatsViewManager object
			 * @extends {ViewManager}
			 * @constructor
			 */
			function StatsViewManager($window, $doc, $navigator, $gameState){
				//super
				ViewManager.call(this, $window, $doc, $navigator, $gameState);

				this.stopButton = $doc.getElementById('stopButton');
				this.clientsTable = $doc.getElementById('clientsTable');

				var self = this;
				EventUtils.addDomListener(this.stopButton, 'click', EventUtils.bind(self, self.handleStopClick));

			}

			//Inherit / Extend
			ObjUtils.inheritPrototype(StatsViewManager,ViewManager);

			StatsViewManager.prototype.updateStatsForClient = function($clientId, $statsData){
				L.log('Stats: ' + $clientId + ' / ' + $statsData.totalSent);
				//TODO: START HERE!
				//update the cells in the table to show the various stats
			};

			StatsViewManager.prototype.handleStopClick = function($e){
				this.dispatchEvent(new JacEvent('stopupdate'));
			};

			StatsViewManager.prototype.addClient = function($client){
				var rowCount = this.clientsTable.rows.length;
				var row = this.clientsTable.insertRow(rowCount);
				var c0 = row.insertCell(0);
				c0.innerHTML = $client.id;
				var c1 = row.insertCell(1);
				c1.innerHTML = 'N/A';
			};

			StatsViewManager.prototype.removeClient = function($client){
				//Remove from view
				for(var i = 0; i < this.clientsTable.rows.length; i++){
					if(this.clientsTable.rows[i].childNodes[0].innerHTML === $client.id){
						//remove
						this.clientsTable.deleteRow(i);
						break;
					}
				}
			};

			StatsViewManager.prototype.updatePing = function($clientIndex, $pingTime){
				this.clientsTable.rows[$clientIndex+1].cells[1].innerHTML = $pingTime;
			};

			StatsViewManager.prototype.render = function(){
			};

			//Return constructor
			return StatsViewManager;
		})();
	});
