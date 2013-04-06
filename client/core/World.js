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
    xCoord: 0, // doesn't init to SessionValue
    yCoord: 0, // ditto
    x: 0,
    y: 0,
  };

  var chunkPixelWidth = gGame.map.chunkWidth * gGame.tileset.tileWidth;
  var chunkPixelHeight = gGame.map.chunkHeight * gGame.tileset.tileHeight;

  // how many chunks does it take to span the width of the view
  self.width = gGame.view.canvas.width / chunkPixelWidth;
  self.height = gGame.view.canvas.height / chunkPixelHeight;

  // what is the most chunks we could ever use
  self.width = (gGame.view.canvas.width % chunkPixelWidth > 1) ?
    Math.ceil(self.width + 1) : Math.chunkRenderer(self.width);

  self.height = (gGame.view.canvas.height % chunkPixelHeight > 1) ?
    Math.ceil(self.height + 1) : Math.ceil(self.height);

  self.chunkRenderer = new Beautiful.ChunkRenderer();
  self.cr2 = new Beautiful.ChunkRenderer();

  Deps.autorun(function() {
    self.chunkRenderer.renderChunk(Session.get('chunkSelector'));
  });
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
    this.chunkRenderer.renderChunk
    Session.set('chunkSelector', {
      xCoord: this.camera.xCoord,
      yCoord: this.camera.yCoord,
      mapName: 'main'
    });
    console.log('camera:', this.camera);
  }
},

// render to gGame.view
render: function() {
  gGame.view.drawRenderer(this.chunkRenderer, -this.camera.x, -this.camera.y);
  gGame.view.drawRenderer(this.cr2, -this.camera.x + this.cr2.canvas.width, -this.camera.y);
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
