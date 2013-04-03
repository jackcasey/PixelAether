/*------------------------------------------------------------
Wrap an action registered with the global input manager. 
------------------------------------------------------------*/
Beautiful.Gesture = function(keyCode, actionName) {
  this.actionName = actionName;
  gGame.input.bind(keyCode, actionName);
};

/*------------------------------------------------------------
drag
------------------------------------------------------------*/
Beautiful.Gesture.prototype = {

drag: function() {

  // make sure the action is in the hold state
  if (!gGame.input.hold(this.actionName)) 
    return false;

  var mouse = gGame.input.mouse;

  // Did the mouse move on this frame?
  if (mouse.moveFrameCount !== gGame.simulation.frameCount)
    return false

  return mouse.deltaPos;
},

}; // Beautiful.Gesture.prototype
