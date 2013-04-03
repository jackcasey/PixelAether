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
------------------------------------------------------------*/
Beautiful.World.prototype = {

moveCamera: function(deltaXY) {
  this.camera.x += deltaXY.x;
  this.camera.y += deltaXY.y;
},

// render to gGame.view
render: function() {
  gGame.view.drawRenderer(this.chunkRenderer, this.camera.x, this.camera.y);
}

}; // Beautiful.World.prototype
