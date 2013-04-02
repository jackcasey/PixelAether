/*------------------------------------------------------------
Beautiful.Renderer Wraps a canvas
------------------------------------------------------------*/


Beautiful.Renderer = function () {
  var self = this;
  self.computation = null; // Meteor Deps.Computation object (when the chunk is set)
  self.chunk = null;
  self.canvas = document.createElement('canvas');
  self.context = self.canvas.getContext('2d');
};

Beautiful.Renderer.prototype.clear = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Beautiful.Renderer.prototype.renderChunk = function(chunkId){

  // Where are we taking from the image
  var xClip;
  var yClip;

  //Where do we position the tiles on the canvas
  var xCursor = 0;
  var yCursor = 0;

  // for convenience
  var tileset = gGame.tileset;
  var tilesetSize = tileset.width * tileset.height;

  // get the chunk
  this.chunk = Chunks.findOne(chunkId);
  if (!this.chunk) return;
  var chunk = this.chunk;
  
  // make sure that the canvas width and height are correct
  if (this.canvas.width !== chunk.width * tileset.tileWidth)
    this.canvas.width = chunk.width * tileset.tileWidth;
  if (this.canvas.height !== chunk.height * tileset.tileHeight)
    this.canvas.height = chunk.height * tileset.tileHeight;

  this.clear();

  // iterate over layers
  for (var layerIndex = 0; layerIndex < chunk.layerNames.length; layerIndex++) {
    var layerName = chunk.layerNames[layerIndex];

    // iterate over layer Data
    for (var i=0; i < chunk.width * chunk.height; i++) {
      var tileIndex = chunk.layerData[layerName][i];

      if (!tileIndex) continue;

      // Get the coordinates of the tile in the tileset
      tileIndex = tileIndex - tileset.firstgid;
      xClip = tileset.getUpperLeftX(tileIndex % tilesetSize); 
      yClip = tileset.getUpperLeftY(tileIndex % tilesetSize);
      xCursor = tileset.tileWidth * (i % chunk.width);
      yCursor = tileset.tileHeight * (Math.floor(i / chunk.width));

      this.context.drawImage(tileset.image,
        xClip, yClip,
        tileset.tileWidth, tileset.tileHeight,
        xCursor, yCursor,
        tileset.tileWidth, tileset.tileHeight);

    } // iterate over layer data
  } // iterate over layers
};
