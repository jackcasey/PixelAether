// Usage:
// var ts = new TileSet( 4, 5, tileWidthInPixels, tileHeightInPixels, ... );
// ts.loadImage('filename', onload function);;

Beautiful.Tileset = function(width, height, tileWidth, tileHeight, cellWidth, cellHeight, validIndexes, firstgid) 
{
  this.width = width; // number tiles wide
  this.height = height; // number tiles tall
  this.tileSize = new Beautiful.Size2D(tileWidth, tileHeight);
  this.cellWidth = cellWidth || tileWidth;
  this.cellHeight = cellHeight || tileHeight;
  this.firstgid = firstgid || 1;

  this.validIndexes = validIndexes || new Array(width * height);
  if (!validIndexes) {
    for (var i = 0; i < width * height; i++) {
      this.validIndexes[i] = i;
    };
  };
};

Beautiful.Tileset.prototype.getUpperLeftX = function(i) {
    return ((i % this.width) * this.cellWidth) + 1;
};

Beautiful.Tileset.prototype.getUpperLeftY = function(i) {
    return (Math.floor(i / this.width) * this.cellHeight) + 1;
};

Beautiful.Tileset.prototype.loadImage = function(src, onload) {
    this.src = src
    this.image = new Image();
    this.image.onload = onload;
    this.image.src = src;
};


/*------------------------------------------------------------
now let's set up the tileSet
for now, let's just have a single tileSet
------------------------------------------------------------*/
gGame.tileset =  new Beautiful.Tileset(
  9, 3,
  28, 35,
  30, 37,
  [0, 1, 10, 11, 12, 13, 14, 15, 16, 17, 18]
);

