/*------------------------------------------------------------
Because the world is very dependent on the map chunksize,
tileset tile size, and view size, the global world object,
gGame.world should be created AFTER the map, view, and tileset
have been initialized.

Keeps Track of
  Where the Camera is looking in the world,
  Which chunks we need to be rendering
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

  var chunkPixelWidth = gGame.map.chunkWidth * gGame.tileset.tileWidth;
  var chunkPixelHeight = gGame.map.chunkHeight * gGame.tileset.tileHeight;

  // how many chunks does it take to span the width of the view
  self.width = gGame.view.canvas.width / chunkPixelWidth;
  self.height = gGame.view.canvas.height / chunkPixelHeight;

  // find max number of chunks we could ever need to fill the World View
  self.width = (gGame.view.canvas.width % chunkPixelWidth > 1) ?
    Math.ceil(self.width + 1) : Math.chunkRenderer(self.width);

  self.height = (gGame.view.canvas.height % chunkPixelHeight > 1) ?
    Math.ceil(self.height + 1) : Math.ceil(self.height);

  // We will reuse renderers, setting the chunk based on where we focus on the map
  self.renderers = new Array(self.width);
  for (var i = 0; i < self.renderers.length; i++) {
    self.renderers[i] = new Beautiful.ChunkRenderer();
  }

  console.log('init chunkRenderer:');
  self.chunkRenderer = new Beautiful.ChunkRenderer();
  console.log('set Chunk:');
  self.chunkRenderer.setChunk({xCoord:0, yCoord:0, mapName:'main'});
  //self.cr2 = new Beautiful.ChunkRenderer();
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
    console.log('camera:', this.camera);
  }
},

// render to gGame.view
render: function() {

  // the distnce between the camera and the left edge of the center tile
  var xOffsetCamera = this.camera.x + this.chunkRenderer.center.x;

  // the distance between the edge of the chunk and the edge of the screen
  var xOffsetCenterChunk = gGame.view.center.x - xOffsetCamera;

  // how many chunks do we render to the right of this one?
  var chunksToRight = Math.ceil(xOffsetCenterChunk / this.chunkRenderer.canvas.width);

  // where do we position our first chunk
  var xStart = -this.camera.x - (this.chunkRenderer.canvas.width * chunksToRight);

  for (var i = 0; i < this.renderers.length; i ++) {
    var renderer = this.renderers[i];
    gGame.view.drawRenderer(renderer, xStart, -this.camera.y);
    xStart += this.chunkRenderer.canvas.width;
  }

  gGame.view.drawRenderer(this.chunkRenderer, -this.camera.x, -this.camera.y);
},

simToWorld: function(xy) {

  var pixelX = xy.x + this.camera.x + this.chunkRenderer.center.x;
  var pixelY = xy.y + this.camera.y + this.chunkRenderer.center.y;
  return {
    x: Math.floor(pixelX / gGame.tileset.tileWidth),
    y: Math.floor(pixelY / gGame.tileset.tileHeight)
  };
}

}; // Beautiful.World.prototype
