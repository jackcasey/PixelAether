/*------------------------------------------------------------

------------------------------------------------------------*/
Beautiful.World = function() {
  var self = this;
  self.camera = {
    xCoord: 0, // doesn't init to SessionValue
    yCoord: 0, // ditto
    x: 0,
    y: 0,
  };

  self.chunkRenderer = new Beautiful.ChunkRenderer();


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
