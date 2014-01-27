/*------------------------------------------------------------
A Tileset stores the metadata for a tilemap image

The tile indexes start at 1 in the upper leftmost tile:
|1|2|3|
|4|5|6|
|7|8|9|
------------------------------------------------------------*/
Tilesets = new Meteor.Collection(null, {
  transform: function(tileset){
    _.extend(tileset, prototype);
    return tileset;
  }
});

Tilesets.create = function(options) {
  var tileset = {
    name: options.name,
    imageName: options.imageName,
    width: options.width, // number tiles wide
    height: options.height, // number tiles tall
    tileWidth: options.tileWidth,
    tileHeight: options.tileHeight,
    cellWidth: options.cellWidth || options.tileWidth,
    cellHeight: options.cellHeight || options.tileHeight
  };
  Tilesets.insert(tileset);
};

var prototype = {
  getUpperLeftX: function(i) {
    return (((i-1) % this.width) * this.cellWidth) + 1;
  },

  getUpperLeftY: function(i) {
    return (Math.floor((i-1) / this.width) * this.cellHeight) + 1;
  }
};

/*------------------------------------------------------------
Static Content
------------------------------------------------------------*/
Tilesets.create({
  name:'elements',
  imageName:'elements',
  width: 9,
  height: 3,
  tileWidth: 28,
  tileHeight: 35,
  cellWidth: 30,
  cellHeight: 37
});
