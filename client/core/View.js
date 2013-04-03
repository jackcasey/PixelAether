Beautiful.View = function() {
  var self = this;
  self.canvas = document.createElement('canvas');
  preventContextMenu(self.canvas);
  self.context = self.canvas.getContext('2d');

  // the most recent mouse position
  self.mouse = {
      x: 0, 
      y: 0
  };

  // what tile is the mouse over?
  self.mouseTile = {
    x: 0,
    y: 0
  };
  // Where is the center of the canvas?
  self.center = {
    x:0,
    y:0
  };
  self.setSize(self.canvas.width, self.canvas.height);

  // wrap input event listeners
  window.addEventListener('mousedown', function(event) {self.mousedown(event)});
  window.addEventListener('mouseup', function(event) {self.mouseup(event)});
  window.addEventListener('mousemove', function(event) {self.mousemove(event)});
  window.addEventListener('keydown', function(event) {self.keydown(event)});
  window.addEventListener('keyup', function(event) {self.keyup(event)});
};


/*------------------------------------------------------------
canvasToSimulation
canvasToWorld
clear
drawRenderer
keydown
keyup
mousedown
mousemove
mouseup
setSize
------------------------------------------------------------*/
Beautiful.View.prototype = {

canvasToSimulation: function(coords) {
  return {
  x:  coords.x - this.center.x,
  y: (coords.y - this.center.y) * -1
 };
},

canvasToWorld: function(coords) {

},

clear: function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
},

drawRenderer: function(renderer, x, y) {
  // x, y are simulation style coords to place the bottom left 
  // corner of the renderer canvas

  // window style coordinates to draw the canvas at
  var drawX = this.center.x + x;
  var drawY = this.center.y - y - renderer.canvas.height;
  drawY++; // fix the fencpost error

  this.context.drawImage(renderer.canvas, drawX, drawY);

},

keydown: function(event) {
  gGame.input._keyDown(event.keyCode, event);
},

keyup: function(event) {
  gGame.input._keyUp(event.keyCode, event);
},

mousedown: function(event) {
  var chunk = Chunks.findOne({xCoord:0, yCoord:0}) // hack! only works if there IS ONLY ONE DOCUMENT
  var tileIndex = (chunk.width * this.mouseTile.y) + this.mouseTile.x;
  var tileValue = chunk.layerData.plant[tileIndex];
  tileValue = (tileValue === 1) ? 0 : 1; // if it's a tree, make it nothing. else, make it a tree
  Meteor.call('setTile', {}, this.mouseTile.x, this.mouseTile.y, tileValue, 'plant');
  // NOT HACK:
  gGame.input._mouseDown(event);
},

mousemove: function(event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var currentElement = this.canvas;

  while (currentElement != null) {
    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;
    currentElement = currentElement.offsetParent;
  }

  var canvasX = event.pageX - totalOffsetX;
  var canvasY = event.pageY - totalOffsetY;

  this.mouse = this.canvasToSimulation({
    x: canvasX,
    y: canvasY
  });

  // pass simulation position to the Input Manager
  gGame.input._mouseMove(this.mouse, event);

  //hack
  this.mouseTile = gGame.tileset.getMapCoord(this.mouse.x, this.mouse.y);
},

mouseup: function(event) {
  gGame.input._mouseUp(event);
},

setSize: function(width, height) {
  this.canvas.width = width;
  this.canvas.height = height;

  this.center.x = Math.floor(width * 0.5);
  this.center.y = Math.floor(height * 0.5);
}

}; // Beautiful.View.prototype
