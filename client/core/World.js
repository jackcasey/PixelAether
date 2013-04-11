/*------------------------------------------------------------
Because the world is very dependent on the map chunksize,
tileset tile size, and view size, the global world object,
gGame.world should be created AFTER the map, view, and tileset
have been initialized.

Keeps Track of
  Where the Camera is looking in the world,
  Which chunks we need to be rendering

Creates a .grid which keeps track of
  Which chunks are we currently rendering
  Where on the view we should render chunks to

Expects the following to exist on instantiation:
  gGame.view (view size has been set)
  gGame.tileset
  gGame.map
------------------------------------------------------------*/
Beautiful.World = function() {
  var self = this;
  self.camera = {
    xCoord: 0,
    yCoord: 0,
    x: 0,
    y: 0,
  };

  var tileSize = gGame.tileset.tileSize.get();
  var chunkPixelWidth = gGame.map.chunkWidth * tileSize.width;
  var chunkPixelHeight = gGame.map.chunkHeight * tileSize.height;

  // how many chunks does it take to span the width of the view
  self.width = gGame.view.canvas.width / chunkPixelWidth;
  self.height = gGame.view.canvas.height / chunkPixelHeight;

  // find max number of chunks we could ever need to fill the World View
  self.width = (gGame.view.canvas.width % chunkPixelWidth > 1) ?
    Math.ceil(self.width + 1) : Math.chunkRenderer(self.width);

  self.height = (gGame.view.canvas.height % chunkPixelHeight > 1) ?
    Math.ceil(self.height + 1) : Math.ceil(self.height);

  self.grid = new Beautiful.ChunkGrid();
  //self.grid.setXRange(-1, 2); // HACK

  // HACK -original method 
  self.chunkRenderer = new Beautiful.ChunkRenderer();
  self.chunkRenderer.setChunk({xCoord:0, yCoord:0, mapName:'main'});
};

/*------------------------------------------------------------
moveCamera
render
simToWorld
------------------------------------------------------------*/
Beautiful.World.prototype = {

moveCamera: function(deltaXY) {
  var newX = this.camera.x += deltaXY.x;
  var newY = this.camera.y += deltaXY.y;

  var changedChunk = false;
  // check if the camera is no longer looking over the chunk
  var checkX = newX + this.chunkRenderer.center.x;
  if (checkX >= this.chunkRenderer.canvas.width) {
    this.camera.x -= this.chunkRenderer.canvas.width;
    this.camera.xCoord += 1;
    changedChunk = true;
  }
  else if (checkX < 0) {
    this.camera.x += this.chunkRenderer.canvas.width;
    this.camera.xCoord -= 1;
    changedChunk = true;
  }

  var checkY = newY + this.chunkRenderer.center.y;
  if (checkY >= this.chunkRenderer.canvas.height) {
    this.camera.y -= this.chunkRenderer.canvas.height;
    this.camera.yCoord += 1;
    changedChunk = true;
  }
  else if (checkY < 0) {
    this.camera.y += this.chunkRenderer.canvas.height;
    this.camera.yCoord -= 1;
    changedChunk = true;
  }

  if (changedChunk) {
    this.chunkRenderer.setChunk({
      xCoord: this.camera.xCoord,
      yCoord: this.camera.yCoord,
      mapName: 'main'
    });
    //console.log('World.js - camera:', this.camera);
  }
},

// render to gGame.view
render: function() {

  // the distnce between the camera and the left edge of the center tile
  var xOffsetCamera = this.camera.x + this.chunkRenderer.center.x;

  // the distance between the edge of the chunk and the edge of the screen
  var xOffsetCenterChunk = gGame.view.size.getCenter().x - xOffsetCamera;

  // how many chunks do we render to the left of this one?
  var chunksToLeft = Math.ceil(xOffsetCenterChunk / this.chunkRenderer.canvas.width);

  // where do we position our first chunk
  var xStart = -this.camera.x - (this.chunkRenderer.canvas.width * chunksToLeft);

  // what is the xCoord of our left most chunk?
  var xCoordLeft = this.camera.xCoord - chunksToLeft;
  var xCoordRight = xCoordLeft + this.width - 1;
  this.grid.setXRange(xCoordLeft, xCoordRight);

  for (var xCoord = xCoordLeft; xCoord <= xCoordRight; xCoord ++) {
    var renderer = this.grid.getRenderer(xCoord, 0, gGame.map.name);
    gGame.view.drawRenderer(renderer, xStart, -this.camera.y);
    xStart += this.chunkRenderer.canvas.width;
  }

  gGame.view.drawRenderer(this.chunkRenderer, -this.camera.x, -this.camera.y);
},

simToWorld: function(xy) {
  var tileSize = gGame.tileset.tileSize.get()
  var pixelX = xy.x + this.camera.x + this.chunkRenderer.center.x;
  var pixelY = xy.y + this.camera.y + this.chunkRenderer.center.y;
  return {
    x: Math.floor(pixelX / tileSize.width),
    y: Math.floor(pixelY / tileSize.height)
  };
}

}; // Beautiful.World.prototype
