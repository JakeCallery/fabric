/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/EventUtils',
'jac/logger/Logger',
'jac/utils/MouseUtils',
'jac/utils/TouchUtils'],
function(EventDispatcher,ObjUtils, EventUtils, L, MouseUtils, TouchUtils){
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
			this.activeTouches = [];

	        //Mouse Event Delegates
	        this.mouseDownDelegate = EventUtils.bind(self, self.handleMouseDown);
	        this.mouseMoveDelegate = EventUtils.bind(self, self.handleMouseMove);
	        this.mouseUpDelegate = EventUtils.bind(self, self.handleMouseUp);
	        this.mouseOutDelegate = EventUtils.bind(self, self.handleMouseOut);
	        EventUtils.addDomListener(this.inputEl, 'mousedown', this.mouseDownDelegate);

	        //Touch Event Delegates
	        this.touchStartDelegate = EventUtils.bind(self, self.handleTouchStart);
	        this.touchEndDelegate = EventUtils.bind(self, self.handleTouchEnd);
	        this.touchCancelDelegate = EventUtils.bind(self, self.handleTouchCancel);
	        this.touchLeaveDelegate = EventUtils.bind(self, self.handleTouchLeave);
	        this.touchMoveDelegate = EventUtils.bind(self, self.handleTouchMove);
			EventUtils.addDomListener(this.inputEl, 'touchstart', this.touchStartDelegate);
			EventUtils.addDomListener(this.inputEl, 'touchend', this.touchEndDelegate);
			EventUtils.addDomListener(this.inputEl, 'touchcancel', this.touchCancelDelegate);
			EventUtils.addDomListener(this.inputEl, 'touchleave', this.touchLeaveDelegate);
			EventUtils.addDomListener(this.inputEl, 'touchmove', this.touchMoveDelegate);

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(InputManager,EventDispatcher);

	    InputManager.prototype.handleTouchStart = function($e){
		    L.log('Caught Touch Start: ' + $e.changedTouches.length);
			$e.preventDefault();
		    for(var i = 0, l = $e.changedTouches.length; i < l; i++){
			    this.activeTouches.push($e.changedTouches[i]);
		    }

	    };

	    InputManager.prototype.handleTouchEnd = function($e){
		    L.log('Caught Touch End: ' + $e.changedTouches.length);
		    $e.preventDefault();
		    var idx = -1;
		    for(var i = 0, l = $e.changedTouches.length; i < l; i++){
			    idx = TouchUtils.getTouchIndex(this.activeTouches, $e.changedTouches[i].identifier);
			    if(idx != -1){
				    this.activeTouches.splice(idx,1);
			    }
		    }
	    };

	    InputManager.prototype.handleTouchMove = function($e){
		    L.log('Caught Touch Move: ' + $e.changedTouches.length);
		    $e.preventDefault();

			var idx = -1;
		    for(var i = 0, l = $e.changedTouches.length; i < l; i++){
			    idx = TouchUtils.getTouchIndex(this.activeTouches, $e.changedTouches[i].identifier);
			    if(idx != -1){
				    this.activeTouches[idx] = $e.changedTouches[i];
			    }
		    }

	    };

	    InputManager.prototype.handleTouchCancel = function($e){
		    L.log('Caught Touch Cancel: ' + $e.changedTouches.length);
		    $e.preventDefault();
		    var idx = -1;
		    for(var i = 0, l = $e.changedTouches.length; i < l; i++){
			    idx = TouchUtils.getTouchIndex(this.activeTouches, $e.changedTouches[i].identifier);
			    if(idx != -1){
				    this.activeTouches.splice(idx,1);
			    }
		    }
	    };

	    InputManager.prototype.handleTouchLeave = function($e){

	    };

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
