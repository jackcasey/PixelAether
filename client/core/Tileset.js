/*------------------------------------------------------------
A Tileset stores the metadata for a tilemap image

The tile indexes start at 1 in the upper leftmost tile:
|1|2|3|
|4|5|6|
|7|8|9|
------------------------------------------------------------*/
Beautiful.Tileset = function(imageName, width, height, tileWidth, tileHeight, cellWidth, cellHeight)
{
  this.imageName = imageName;
  this.width = width; // number tiles wide
  this.height = height; // number tiles tall
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  this.cellWidth = cellWidth || tileWidth;
  this.cellHeight = cellHeight || tileHeight;
};


/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.Tileset.prototype = {

getUpperLeftX: function(i) {
  return (((i-1) % this.width) * this.cellWidth) + 1;
},

getUpperLeftY: function(i) {
  return (Math.floor((i-1) / this.width) * this.cellHeight) + 1;
}

}; // Beautiful.Tileset.prototype
