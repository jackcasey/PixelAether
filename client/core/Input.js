var InputState = function() {
  this.downTime = new Date(0);
  this.downFrameCount = -2;
  this.downSimPos = {x:0, y:0};
  this.upTime = new Date(1);
  this.upFrameCount = -1;
  this.upSimPos = {x:0, y:0};
}

Beautiful.Input = function() {

  // States
  // Keycodes mapped to key state
  this.states = {};

  for (key in this.KEY){
    var keyCode = this.KEY[key];
    this.states[keyCode] = new InputState;
  }

  // always keep track of mouse movement
  this.mouse = {
    simPos:           {x:0, y:0},
    deltaPos:         {x:0, y:0},
    moveTime:         new Date(),
    moveFrameCount:   0,
  };
};

/*------------------------------------------------------------
drag
hold
isDown
tap
up

TAP_THRESH
DRAG_THRESH

_keyDown
_keyUp
_mouseDown
_mouseMove
_mouseUp

KEY
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

  return false
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
  var keyCode = (event.button === 0) ? this.KEY.MOUSE1 : this.KEY.MOUSE2;
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
  var keyCode= (event.button === 0) ? this.KEY.MOUSE1 : this.KEY.MOUSE2;
  this._keyUp(keyCode, event);
},

KEY: {
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

// ASCII: {
//   "8": "BACKSPACE",
//   "9": "TAB",
//   "13": "ENTER",
//   "16": "SHIFT",
//   "17": "CTRL",
//   "18": "ALT",
//   "19": "PAUSE",
//   "20": "CAPS",
//   "27": "ESC",
//   "32": "SPACE",
//   "33": "PAGE_UP",
//   "34": "PAGE_DOWN",
//   "35": "END",
//   "36": "HOME",
//   "37": "LEFT_ARROW",
//   "38": "UP_ARROW",
//   "39": "RIGHT_ARROW",
//   "40": "DOWN_ARROW",
//   "45": "INSERT",
//   "46": "DELETE",
//   "48": "0",
//   "49": "1",
//   "50": "2",
//   "51": "3",
//   "52": "4",
//   "53": "5",
//   "54": "6",
//   "55": "7",
//   "56": "8",
//   "57": "9",
//   "65": "A",
//   "66": "B",
//   "67": "C",
//   "68": "D",
//   "69": "E",
//   "70": "F",
//   "71": "G",
//   "72": "H",
//   "73": "I",
//   "74": "J",
//   "75": "K",
//   "76": "L",
//   "77": "M",
//   "78": "N",
//   "79": "O",
//   "80": "P",
//   "81": "Q",
//   "82": "R",
//   "83": "S",
//   "84": "T",
//   "85": "U",
//   "86": "V",
//   "87": "W",
//   "88": "X",
//   "89": "Y",
//   "90": "Z",
//   "96": "NUMPAD_0",
//   "97": "NUMPAD_1",
//   "98": "NUMPAD_2",
//   "99": "NUMPAD_3",
//   "100": "NUMPAD_4",
//   "101": "NUMPAD_5",
//   "102": "NUMPAD_6",
//   "103": "NUMPAD_7",
//   "104": "NUMPAD_8",
//   "105": "NUMPAD_9",
//   "106": "MULTIPLY",
//   "107": "ADD",
//   "109": "SUBSTRACT",
//   "110": "DECIMAL",
//   "111": "DIVIDE",
//   "112": "F1",
//   "113": "F2",
//   "114": "F3",
//   "115": "F4",
//   "116": "F5",
//   "117": "F6",
//   "118": "F7",
//   "119": "F8",
//   "120": "F9",
//   "121": "F10",
//   "122": "F11",
//   "123": "F12",
//   "187": "PLUS",
//   "188": "COMMA",
//   "189": "MINUS",
//   "190": "PERIOD",
//   "function () { return \"function \" + name + \"() { [Command Line API] }\"; }": "toString",
//   "-1": "MOUSE1",
//   "-3": "MOUSE2"
// }


}; // Beautiful.Input.prototype
