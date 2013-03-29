Beautiful.Renderer = function (canvas, width, height) {
  self = this;
  self.canvas = canvas;
  self.context = canvas.getContext('2d');
  self.canvas.height = height || 600;
  self.canvas.width = width || 500;
  // the most recent mouse position
  self.mouse = {
    x: 0, 
    y: 0
  };

  // wrap to bind functions to this object
  window.addEventListener('mousedown', function(event) {self.mousedown(event)});
  window.addEventListener('mouseup', function(event) {self.mouseup(event)});
  window.addEventListener('mousemove', function(event) {self.mousemove(event)});
}

Beautiful.Renderer.prototype.mousedown = function(event) {
  console.log(this);
};

Beautiful.Renderer.prototype.mouseup  = function(event) {

};

Beautiful.Renderer.prototype.mousemove = function(event) {
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

  this.mouse.x = event.pageX - totalOffsetX;
  this.mouse.y = event.pageY - totalOffsetY;
};


Beautiful.Renderer.prototype.renderChunk = function(chunkId){
  // Where are we taking from the image
  var xClip;
  var yClip;

  //Where do we position the tiles on the canvas
  var xCursor = 0;
  var yCursor = 0;

  // for convenience
  var tileset = Beautiful.tileset;
  var tilesetSize = tileset.width * tileset.height;

  var chunk = Chunks.findOne(chunkId);
  if (!chunk) return;

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
