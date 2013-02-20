// Usage:
// var ts = new TileSet( 4, 5, tileWidthInPixels, tileHeightInPixels, ... );
// ts.loadImage('filename', onload function);;

var TileSet = function(width, height, tileWidth, tileHeight, cellWidth, cellHeight, validIndexes) 
{
	this.width = width; // number tiles wide
	this.height = height; // number tiles tall
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.cellWidth = cellWidth || tileWidth;
	this.cellHeight = cellHeight || tileHeight;
	this.length = width * height;
	this.validIndexes = validIndexes || new Array(this.length);
	if (!validIndexes) {
	  for (var i=0; i<this.length; i ++){
	    this.validIndexes[i] = i;
	  };
	};
};

TileSet.prototype = {
	getUpperLeftX: function(i) {
		return ((i % this.width) * this.cellWidth) + 1;
	},

	getUpperLeftY: function(i) {
		return (Math.floor(i / this.width) * this.cellHeight) + 1;
	},

	loadImage: function(src, onload) {
		this.src = src
		this.image = new Image();
		this.image.onload = onload;
		this.image.src = src;
	}
};
