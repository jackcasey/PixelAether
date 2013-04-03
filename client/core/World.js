/*------------------------------------------------------------

------------------------------------------------------------*/
Beautiful.World = function() {
  var self = this;
  self.camera = {
    xCoord: 0,
    yCoord: 0,
    x: 0,
    y: 0,
  };

  self.chunkRenderer = new Beautiful.ChunkRenderer();

  var selector = {xCoord:0, yCoord:0, mapName:'main'};

  Deps.autorun(function() {
    self.chunkRenderer.renderChunk(selector);
  });
};

/*------------------------------------------------------------
moveCamera
render
simToWorld
------------------------------------------------------------*/
Beautiful.World.prototype = {

moveCamera: function(deltaXY) {
  this.camera.x += deltaXY.x;
  this.camera.y += deltaXY.y;
  //console.log('camera:', this.camera);
},

// render to gGame.view
render: function() {
  gGame.view.drawRenderer(this.chunkRenderer, -this.camera.x, -this.camera.y);
},

simToWorld: function(xy) {

  var pixelX = xy.x + this.camera.x
  var pixelY = xy.y + this.camera.y
  return {
    x: Math.floor(pixelX / gGame.tileset.tileWidth),
    y: Math.floor(pixelY / gGame.tileset.tileHeight)
  };
}

}; // Beautiful.World.prototype
