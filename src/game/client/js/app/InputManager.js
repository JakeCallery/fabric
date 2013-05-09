/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/EventUtils',
'jac/logger/Logger',
'jac/utils/MouseUtils'],
function(EventDispatcher,ObjUtils, EventUtils, L, MouseUtils){
    return (function(){
        /**
         * Creates a InputManager object
         * @param {Element} $inputDomEl
         * @extends {EventDispatcher}
         * @constructor
         */
        function InputManager($inputDomEl){
            //super
            EventDispatcher.call(this);

	        var self = this;
	        this.inputEl = $inputDomEl;

	        //Mouse Events
	        this.mouseDownDelegate = EventUtils.bind(self, self.handleMouseDown);
	        this.mouseMoveDelegate = EventUtils.bind(self, self.handleMouseMove);
	        this.mouseUpDelegate = EventUtils.bind(self, self.handleMouseUp);
	        this.mouseOutDelegate = EventUtils.bind(self, self.handleMouseOut);

	        EventUtils.addDomListener(this.inputEl, 'mousedown', this.mouseDownDelegate);

	        //Touch Events
			//TODO: Handle touch events

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(InputManager,EventDispatcher);

	    InputManager.prototype.handleMouseDown = function($e){
		    var obj = {};
		    MouseUtils.getRelCoords(this.inputEl, $e, obj);
	        L.log('Caught Mouse Down: ' + obj.x + ',' + obj.y);

		    EventUtils.addDomListener(this.inputEl, 'mousemove', this.mouseMoveDelegate);
		    EventUtils.addDomListener(this.inputEl, 'mouseup', this.mouseUpDelegate);
		    EventUtils.addDomListener(this.inputEl, 'mouseout', this.mouseOutDelegate);
	    };

	    InputManager.prototype.handleMouseMove = function($e){
		    var obj = {};
		    MouseUtils.getRelCoords(this.inputEl, $e, obj);
		    L.log('Caught Mouse Move: ' + obj.x + ',' + obj.y);
	    };

	    InputManager.prototype.handleMouseUp = function($e){
		    var obj = {};
		    MouseUtils.getRelCoords(this.inputEl, $e, obj);
		    L.log('Caught Mouse Up: ' + obj.x + ',' + obj.y);

		    EventUtils.removeDomListener(this.inputEl, 'mousemove', this.mouseMoveDelegate);
		    EventUtils.removeDomListener(this.inputEl, 'mouseup', this.mouseUpDelegate);
		    EventUtils.removeDomListener(this.inputEl, 'mouseout', this.mouseOutDelegate);
	    };

	    InputManager.prototype.handleMouseOut = function($e){
		    var obj = {};
		    MouseUtils.getRelCoords(this.inputEl, $e, obj);
		    L.log('Caught Mouse Out: ' + obj.x + ',' + obj.y);

		    EventUtils.removeDomListener(this.inputEl, 'mousemove', this.mouseMoveDelegate);
		    EventUtils.removeDomListener(this.inputEl, 'mouseup', this.mouseUpDelegate);
		    EventUtils.removeDomListener(this.inputEl, 'mouseout', this.mouseOutDelegate);
	    };

        //Return constructor
        return InputManager;
    })();
});
