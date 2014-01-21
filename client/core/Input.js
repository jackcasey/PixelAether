// Helper Class - Stores the state of a pressable key
var InputState = function() {
  this.downTime = new Date(0);
  this.downFrameCount = -2;
  this.downSimPos = {x:0, y:0};
  this.upTime = new Date(1);
  this.upFrameCount = -1;
  this.upSimPos = {x:0, y:0};
};

// Helper class, Stores input identifiers, and bound functions
var InputAction = function(keyCode, action, func) {
  this.keyCode = keyCode;
  this.action = action;
  this.functions = [];
  if (func) this.functions.push(func);
};

Beautiful.Input = function() {

  // Actions - keycode-action mapped to function list
  // ex. 73-up
  this.actions = {};

  // States - Keycodes mapped to key state
  this.states = {};

  for (key in this.KEYS){
    var keyCode = this.KEYS[key];
    this.states[keyCode] = new InputState;
  }

  // always keep track of mouse movement
  this.mouse = {
    simPos:           {x:0, y:0},
    deltaPos:         {x:0, y:0},
    moveTime:         new Date(),
    moveFrameCount:   0
  };
};

/*------------------------------------------------------------
drag
hold
isDown
on
tap
step
up

TAP_THRESH
DRAG_THRESH

_keyDown
_keyUp
_mouseDown
_mouseMove
_mouseUp

KEYS
------------------------------------------------------------*/
Beautiful.Input.prototype = {

TAP_THRESH: 200, // in millisec
DRAG_THRESH: 15, // in pixels

drag: function(keyCode) {
  var state = this.states[keyCode];
  if (!state) return null;

  var deltaX = this.mouse.simPos.x - state.downSimPos.x;
  var deltaY = this.mouse.simPos.y - state.downSimPos.y;
  var hyp = hypotenuse(deltaX, deltaY);

  if (
    // if the action is holding, or we moved with this mouse down
    (this.hold(keyCode) || (this.isDown(keyCode) && hyp >= this.DRAG_THRESH)) &&
    // and the mouse moved this frame
    this.mouse.moveFrameCount === gGame.simulation.frameCount
  ) return true;

  return false;
},

hold: function(keyCode) {
  var state = this.states[keyCode];
  if (!state) return null;

  var sim = gGame.simulation;
  var downDuration = sim.frameTime - state.downTime;

  if (state.downFrameCount > state.upFrameCount && // action is down
    downDuration > this.TAP_THRESH) // and has been down for a while
    return true;

  return false;
},

isDown: function(keyCode) {
  var state = this.states[keyCode];
  if (!state) return null;

  if (state.downFrameCount > state.upFrameCount)
    return true;

  return false;
},

on: function(key, action, func) {
  // alow string or number
  var keyCode = (typeof key === 'string') ? this.KEYS[key.toUpperCase()] : key;
  this.actions[keyCode + '-' + action] = new InputAction(keyCode, action, func);
},

tap: function(keyCode) {
  var state = this.states[keyCode];
  if (!state) return null;

  var sim = gGame.simulation;
  var downDuration = state.upTime - state.downTime; // accurate when upTime happened in this frame
 
  if (downDuration > 0 &&
    state.upFrameCount === sim.frameCount && // keyUp happened in this Frame
    downDuration <= this.TAP_THRESH) {
    return true; 
  }

  return false;
},

step: function(){
  self = this;
  for (key in this.actions){
    var iAction = this.actions[key]; // input action
    if (self[iAction.action](iAction.keyCode)) {
      for (var i = 0; i < iAction.functions.length; i++){
        iAction.functions[i]();
      }
    }
  }
},

up: function(keyCode) {
  var state = this.states[keyCode];
  if (!state) return null;

  if (state.upFrameCount === gGame.simulation.frameCount)
    return true;

  return false;
},

_keyDown: function(keyCode, event) {
  // if there is no state associated with this key, ignore
  var state = this.states[keyCode];
  if (!state) return;

  // don't let the browser handle this key
  if (keyCode >= 0 && event.cancelable) event.preventDefault();

  // if the last event was a key down don't re-trigger!
  if (state.downFrameCount > state.upFrameCount) return;

  var sim = gGame.simulation;
  state.downTime = sim.frameTime;
  state.downFrameCount = sim.frameCount;
  state.downSimPos.x = this.mouse.simPos.x;
  state.downSimPos.y = this.mouse.simPos.y;
},

_keyUp: function(keyCode, event) {
  // if there is no state associated with this key, ignore
  var state = this.states[keyCode];
  if (!state) return;

  // if the state is up, don't do keyUp again
  if (!this.isDown(keyCode)) return;

  var sim = gGame.simulation;
  state.upTime = sim.frameTime;
  state.upFrameCount = sim.frameCount;
  state.upSimPos.x = this.mouse.simPos.x;
  state.upSimPos.y = this.mouse.simPos.y;
},

_mouseDown: function(event) {
  var keyCode = (event.button === 0) ? this.KEYS.MOUSE1 : this.KEYS.MOUSE2;
  this._keyDown(keyCode, event);
},

_mouseMove: function(position, event) {
  this.mouse.deltaPos.x = position.x - this.mouse.simPos.x;
  this.mouse.deltaPos.y = position.y - this.mouse.simPos.y;
  this.mouse.simPos.x = position.x;
  this.mouse.simPos.y = position.y;
  this.mouse.moveTime = gGame.simulation.frameTime;
  this.mouse.moveFrameCount = gGame.simulation.frameCount;
  //console.log(this.mouse.deltaPos);
},

_mouseUp: function(event) {
  var keyCode= (event.button === 0) ? this.KEYS.MOUSE1 : this.KEYS.MOUSE2;
  this._keyUp(keyCode, event);
},

KEYS: {
  'MOUSE1': -1,
  'MOUSE2': -3,
  //'MWHEEL_UP': -4,
  //'MWHEEL_DOWN': -5,

  'BACKSPACE': 8,
  'TAB': 9,
  'ENTER': 13,
  'PAUSE': 19,
  'CAPS': 20,
  'ESC': 27,
  'SPACE': 32,
  'PAGE_UP': 33,
  'PAGE_DOWN': 34,
  'END': 35,
  'HOME': 36,
  'LEFT_ARROW': 37,
  'UP_ARROW': 38,
  'RIGHT_ARROW': 39,
  'DOWN_ARROW': 40,
  'INSERT': 45,
  'DELETE': 46,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'A': 65,
  'B': 66,
  'C': 67,
  'D': 68,
  'E': 69,
  'F': 70,
  'G': 71,
  'H': 72,
  'I': 73,
  'J': 74,
  'K': 75,
  'L': 76,
  'M': 77,
  'N': 78,
  'O': 79,
  'P': 80,
  'Q': 81,
  'R': 82,
  'S': 83,
  'T': 84,
  'U': 85,
  'V': 86,
  'W': 87,
  'X': 88,
  'Y': 89,
  'Z': 90,
  'NUMPAD_0': 96,
  'NUMPAD_1': 97,
  'NUMPAD_2': 98,
  'NUMPAD_3': 99,
  'NUMPAD_4': 100,
  'NUMPAD_5': 101,
  'NUMPAD_6': 102,
  'NUMPAD_7': 103,
  'NUMPAD_8': 104,
  'NUMPAD_9': 105,
  'MULTIPLY': 106,
  'ADD': 107,
  'SUBSTRACT': 109,
  'DECIMAL': 110,
  'DIVIDE': 111,
  'F1': 112,
  'F2': 113,
  'F3': 114,
  'F4': 115,
  'F5': 116,
  'F6': 117,
  'F7': 118,
  'F8': 119,
  'F9': 120,
  'F10': 121,
  'F11': 122,
  'F12': 123,
  'SHIFT': 16,
  'CTRL': 17,
  'ALT': 18,
  'PLUS': 187,
  'COMMA': 188,
  'MINUS': 189,
  'PERIOD': 190
}

}; // Beautiful.Input.prototype
