/*------------------------------------------------------------
Because the world is very dependent on the map chunksize,
tileset tile size, and view size, the global world object,
gGame.world should be created AFTER the map, view, and tileset
have been initialized.

Keeps Track of
  Where the Camera is looking in the world,
  Which chunks we need to be rendering
  What current tileset and current map

Creates a .grid which keeps track of
  Which chunks are we currently rendering
  Where on the view we should render chunks to

Expects the following to exist on instantiation:
  gGame.view (view size has been set)
  gGame.tileset
  gGame.map
------------------------------------------------------------*/
Beautiful.World = function(map, tileset) {
  var self = this;

  self._tilesetDep = new Deps.Dependency;
  self._mapDep = new Deps.Dependency;

  self.chunkPixelSize = new Beautiful.Size2D;
  self.setMap(map || Beautiful.Maps.main);
  self.setTileset(tileset || new Beautiful.Tileset(
    images['elements9x3.png'],
    9, 3,
    28, 35,
    30, 37 ));

  self.camera = {
    xCoord: 0,
    yCoord: 0,
    x: 0,
    y: 0 };

  var cpSize = self.chunkPixelSize.get();

  // how many chunks does it take to span the width of the view
  self.width = gGame.view.canvas.width / cpSize.width;
  self.height = gGame.view.canvas.height / cpSize.height;

  // find max number of chunks we could ever need to fill the World View
  self.width = (gGame.view.canvas.width % cpSize.width > 1) ?
    Math.ceil(self.width + 1) : Math.ceil(self.width);

  self.height = (gGame.view.canvas.height % cpSize.height > 1) ?
    Math.ceil(self.height + 1) : Math.ceil(self.height);

  self.grid = new Beautiful.ChunkGrid();
};

/*------------------------------------------------------------
getMap
getTileset
moveCamera
render
setMap
setTileset
simToWorld
------------------------------------------------------------*/
Beautiful.World.prototype = {

getMap: function() {
  this._mapDep.depend();
  return this._map;
},

getTileset: function() {
  this._tilesetDep.depend();
  return this._tileset;
},

moveCamera: function(deltaXY) {
  var newX = this.camera.x += deltaXY.x;
  var newY = this.camera.y += deltaXY.y;

  var cpSize = this.chunkPixelSize.get();
  var cpCenter = this.chunkPixelSize.getCenter();

  var changedChunk = false;
  // check if the camera is no longer looking over the chunk
  var checkX = newX + cpCenter.x;
  if (checkX >= cpSize.width) {
    this.camera.x -= cpSize.width;
    this.camera.xCoord += 1;
    changedChunk = true;
  }
  else if (checkX < 0) {
    this.camera.x += cpSize.width;
    this.camera.xCoord -= 1;
    changedChunk = true;
  }

  var checkY = newY + cpCenter.y;
  if (checkY >= cpSize.height) {
    this.camera.y -= cpSize.height;
    this.camera.yCoord += 1;
    changedChunk = true;
  }
  else if (checkY < 0) {
    this.camera.y += cpSize.height;
    this.camera.yCoord -= 1;
    changedChunk = true;
  }

  if (changedChunk) {
    console.log('World.js - camera:', this.camera);
  }
},

// render to gGame.view
render: function() {

  var cpSize = this.chunkPixelSize.get();
  var cpCenter = this.chunkPixelSize.getCenter();

  // the distnce between the camera and the left edge of the center tile
  var xOffsetCamera = this.camera.x + cpCenter.x;

  // the distance between the edge of the chunk and the edge of the screen
  var xOffsetCenterChunk = gGame.view.size.getCenter().x - xOffsetCamera;

  // how many chunks do we render to the left of this one?
  var chunksToLeft = Math.ceil(xOffsetCenterChunk / cpSize.width);

  // where do we position our first chunk
  var xStart = -this.camera.x - (cpSize.width * chunksToLeft);

  // what is the xCoord of our left most chunk?
  var xCoordLeft = this.camera.xCoord - chunksToLeft;
  var xCoordRight = xCoordLeft + this.width - 1;
  this.grid.setXRange(xCoordLeft, xCoordRight);

  for (var xCoord = xCoordLeft; xCoord <= xCoordRight; xCoord ++) {
    var renderer = this.grid.getRenderer(xCoord, 0, gGame.map.name);
    gGame.view.drawRenderer(renderer, xStart, -this.camera.y);
    xStart += cpSize.width;
  }
},

setMap: function(map) {
  this._map = map;
    if (this._tileset && this._map)
    this.chunkPixelSize.set(
      this._tileset.tileWidth * this._map.chunkWidth,
      this._tileset.tileHeight * this._map.chunkHeight);

  this._mapDep.changed();
},

setTileset: function(tileset) {
  this._tileset = tileset;
  if (this._tileset && this._map)
    this.chunkPixelSize.set(
      this._tileset.tileWidth * this._map.chunkWidth,
      this._tileset.tileHeight * this._map.chunkHeight);

  this._tilesetDep.changed();
},

simToWorld: function(xy) {
  var tileset = gGame.tileset;
  var cpCenter = this.chunkPixelSize.getCenter();
  var pixelX = xy.x + this.camera.x + cpCenter.x;
  var pixelY = xy.y + this.camera.y + cpCenter.y;
  return {
    x: Math.floor(pixelX / tileset.tileWidth),
    y: Math.floor(pixelY / tileset.tileHeight)
  };
}

}; // Beautiful.World.prototype
