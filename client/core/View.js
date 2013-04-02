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

Beautiful.View.prototype.clear = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Beautiful.View.prototype.drawRenderer = function(renderer, x, y) {
  // x, y are simulation style coords to place the bottom left 
  // corner of the renderer canvas

  // window style coordinates to draw the canvas at
  var drawX = this.center.x + x;
  var drawY = this.center.y - y - renderer.canvas.height;

  this.context.drawImage(renderer.canvas, drawX, drawY);

}

Beautiful.View.prototype.keydown = function(event) {
  event.preventDefault(); // HACK to stop spacebar from scrolling down
  gGame.input._keyDown(event);
}

Beautiful.View.prototype.keyup = function(event) {
  gGame.input._keyUp(event);
}

Beautiful.View.prototype.mousedown = function(event) {
  var chunk = Chunks.findOne({xCoord:0, yCoord:0}) // hack! only works if there IS ONLY ONE DOCUMENT
  var tileIndex = (chunk.width * this.mouseTile.y) + this.mouseTile.x;
  var tileValue = chunk.layerData.plant[tileIndex];
  tileValue = (tileValue === 1) ? 0 : 1; // if it's a tree, make it nothing. else, make it a tree
  Meteor.call('setTile', {}, this.mouseTile.x, this.mouseTile.y, tileValue, 'plant');
  console.log(this.mouse);
};

Beautiful.View.prototype.mousemove = function(event) {
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

  this.mouse.x = event.pageX - totalOffsetX - this.center.x;
  this.mouse.y = (event.pageY - totalOffsetY - this.center.y) * -1;
  this.mouseTile = gGame.tileset.getMapCoord(
    this.mouse.x, this.mouse.y);
};

Beautiful.View.prototype.mouseup  = function(event) {

};

Beautiful.View.prototype.setSize = function(width, height) {
  this.canvas.width = width;
  this.canvas.height = height;

  this.center.x = Math.floor(width * 0.5);
  this.center.y = Math.floor(height * 0.5);
}
