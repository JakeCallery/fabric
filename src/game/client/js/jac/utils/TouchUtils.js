/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var TouchUtils = {};

	    /**
	     * Find the index of a touch in a list of touches
	     * @param {Array.<Touch>} $touchList
	     * @param {string} $id
	     * @returns {number}
	     */
        TouchUtils.getTouchIndex = function($touchList, $id){
	        for(var i = 0, l = $touchList.length; i < l; i++){
				if($id === $touchList[i].identifier){
					return i;
				}
	        }
	        return -1;
        };

        //Return constructor
        return TouchUtils;
    })();
});
