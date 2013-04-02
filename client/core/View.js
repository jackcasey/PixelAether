Beautiful.View = function() {
  var self = this;
  self.canvas = document.createElement('canvas');
  preventContextMenu(self.canvas);
  self.context = self.canvas.getContext('2d');

  // the most recent mouse position
  self.mouse = {
    canvas: {
      x: 0, 
      y: 0
    },
    sim: {
      x:0,
      y:0
    }
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

  // wrap to bind functions to this object
  window.addEventListener('mousedown', function(event) {self.mousedown(event)});
  window.addEventListener('mouseup', function(event) {self.mouseup(event)});
  window.addEventListener('mousemove', function(event) {self.mousemove(event)});
  window.addEventListener('keydown', function(event) {self.keydown(event)});
  window.addEventListener('keyup', function(event) {self.keyup(event)});
};


/*------------------------------------------------------------
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
  gGame.input._keyDown(event);
},

keyup: function(event) {
  gGame.input._keyUp(event);
},

mousedown: function(event) {
  var chunk = Chunks.findOne({xCoord:0, yCoord:0}) // hack! only works if there IS ONLY ONE DOCUMENT
  var tileIndex = (chunk.width * this.mouseTile.y) + this.mouseTile.x;
  var tileValue = chunk.layerData.plant[tileIndex];
  tileValue = (tileValue === 1) ? 0 : 1; // if it's a tree, make it nothing. else, make it a tree
  Meteor.call('setTile', {}, this.mouseTile.x, this.mouseTile.y, tileValue, 'plant');
  console.log('sim, canvas');
  console.log(this.mouse.sim);
  console.log(this.mouse.canvas);
},

mousemove: function(event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this.canvas;

  while (currentElement != null) {
    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;
    currentElement = currentElement.offsetParent;
  }

  var mc = this.mouse.canvas;
  var ms = this.mouse.sim;
  mc.x = event.pageX - totalOffsetX;
  mc.y = event.pageY - totalOffsetY;

  ms.x =  mc.x - this.center.x;
  ms.y = (mc.y - this.center.y) * -1;

  this.mouseTile = gGame.tileset.getMapCoord(ms.x, ms.y);
},

mouseup: function(event) {

},

setSize: function(width, height) {
  this.canvas.width = width;
  this.canvas.height = height;

  this.center.x = Math.floor(width * 0.5);
  this.center.y = Math.floor(height * 0.5);
}

}; // Beautiful.View.prototype
