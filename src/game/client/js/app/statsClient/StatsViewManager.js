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

			StatsViewManager.prototype.updateStatsForClient = function($clientIndex, $statsData){
				//update the cells in the table to show the various stats
				var row = this.clientsTable.rows[$clientIndex+1];

				//client id [0] (not updated here)
				//ping [1] (not updated here, maybe it should be?)

				//Num Messages sent [2]
				row.childNodes[2].innerHTML = $statsData.totalSent;

				//Num Messages received [3]
				row.childNodes[3].innerHTML = $statsData.totalRec;

				//Send Rate per sec [4]
				if($statsData.sendRate > 0){
					row.childNodes[4].innerHTML = Math.round($statsData.sendRate);
				} else {
					row.childNodes[4].innerHTML = '< 1';
				}

				//Receive rate per sec [5]
				if($statsData.recRate > 0){
					row.childNodes[5].innerHTML = Math.round($statsData.recRate);
				} else {
					row.childNodes[5].innerHTML = '< 1';
				}


			};

			StatsViewManager.prototype.handleStopClick = function($e){
				this.dispatchEvent(new JacEvent('stopupdate'));
			};

			StatsViewManager.prototype.addClient = function($client){
				var rowCount = this.clientsTable.rows.length;
				var row = this.clientsTable.insertRow(rowCount);
				var cell;

				//Client ID
				cell = row.insertCell(0);
				cell.innerHTML = $client.id;

				//Ping
				cell = row.insertCell(1);
				cell.innerHTML = 'N/A';

				//Total Sent
				cell = row.insertCell(2);
				cell.innerHTML = 'N/A';

				//Total Rec
				cell = row.insertCell(3);
				cell.innerHTML = 'N/A';

				//Send Rate
				cell = row.insertCell(4);
				cell.innerHTML = 'N/A';

				//Receive Rate
				cell = row.insertCell(5);
				cell.innerHTML = 'N/A';

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
