/*------------------------------------------------------------
Because the world is very dependent on the map chunksize,
tileset tile size, and view size, the global world object,
gGame.world should be created AFTER the map, view, and tileset
have been initialized.

Keeps Track of
  Where the Camera is looking in the world,
  world.size - max number of chunks that could be rendered
  Range of chunks to render given the view, chunkPixelSize
  What current tileset and current map

Creates a .grid which keeps track of
  Which chunks are we currently rendering
  Where on the view we should render chunks to

Expects the following to exist on instantiation:
  gGame.view (view size has been set)
  gGame.world
------------------------------------------------------------*/
Beautiful.World = function(map, tileset) {
  var self = this;

  self._tilesetDep = new Deps.Dependency;
  self._mapDep = new Deps.Dependency;

  self.chunkPixelSize = new Beautiful.Size2D;
  self.size = new Beautiful.Size2D;
  self.setMap(map);
  self.setTileset(tileset);

  self.camera = {
    xCoord: 0,
    yCoord: 0,
    x: 0,
    y: 0 };

  Meteor.autorun(function(){
    self.updateSize();
  });

  Meteor.autorun(function(){
    var map = self.getMap();
    var tileset = self.getTileset();
    if (tileset && map)
      self.chunkPixelSize.set(
        tileset.tileWidth * map.chunkWidth,
        tileset.tileHeight * map.chunkHeight);
  });

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
updateSize
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

  Deps.flush();

  var cpSize = this.chunkPixelSize.get();
  var cpCenter = this.chunkPixelSize.getCenter();
  var viewCenter = gGame.view.size.getCenter();
  var map = this.getMap();
  var size = this.size.get();

  // the distnce between the camera and the left edge of the center tile
  var xOffsetCamera = this.camera.x + cpCenter.x;
  var yOffsetCamera = this.camera.y + cpCenter.y;
  // the distance between the edge of the chunk and the edge of the screen
  var xOffsetCenterChunk = viewCenter.x - xOffsetCamera;
  var yOffsetCenterChunk = viewCenter.y - yOffsetCamera;
  // how many chunks do we render to the left of this one?
  var chunksToLeft = Math.ceil(xOffsetCenterChunk / cpSize.width);
  var chunksBelow = Math.ceil(yOffsetCenterChunk / cpSize.height);
  // where do we position our first chunk
  var xStart = -this.camera.x - (cpSize.width * chunksToLeft);
  var yStart = -this.camera.y - (cpSize.height * chunksBelow);
  // what is the xCoord of our left most chunk?
  var xCoordLeft = this.camera.xCoord - chunksToLeft;
  var xCoordRight = xCoordLeft + size.width - 1;

  var yCoordBottom = this.camera.yCoord - chunksBelow;
  var yCoordTop = yCoordBottom + size.height - 1;

  this.grid.setRange(xCoordLeft, xCoordRight, yCoordBottom, yCoordTop);
  var xCursor = xStart;
  var yCursor = yStart;

  for (var yCoord = yCoordBottom; yCoord <= yCoordTop; yCoord++) {
    for (var xCoord = xCoordLeft; xCoord <= xCoordRight; xCoord ++) {
      var renderer = this.grid.getRenderer(xCoord, yCoord, map.name);
      gGame.view.drawRenderer(renderer, xCursor, yCursor);
      xCursor += cpSize.width;
    } // xCoord for loop
    yCursor += cpSize.height;
    xCursor = xStart;
  } // yCoord for loop
},

setMap: function(map) {
  this._map = map;
  this._mapDep.changed();
},

setTileset: function(tileset) {
  this._tileset = tileset;
  this._tilesetDep.changed();
},

simToWorld: function(xy) {
  var tileset = gGame.world.getTileset();
  var cpCenter = this.chunkPixelSize.getCenter();
  var map = this.getMap();
  var pixelX = xy.x + this.camera.x + cpCenter.x;
  var pixelY = xy.y + this.camera.y + cpCenter.y;
  var tileX = Math.floor(pixelX / tileset.tileWidth);
  var tileY = Math.floor(pixelY / tileset.tileHeight);
  var ans = {
    xCoord: this.camera.xCoord + Math.floor(tileX / map.chunkWidth),
    yCoord: this.camera.yCoord + Math.floor(tileY / map.chunkHeight),
    x: tileX % map.chunkWidth,
    y: tileY % map.chunkHeight
  };
  if (ans.x < 0) ans.x += map.chunkWidth;
  if (ans.y < 0) ans.y += map.chunkHeight;
  return ans;
},

updateSize: function(){
  var self = this;
  var cpSize = self.chunkPixelSize.get();
  var viewSize = gGame.view.size.get();

  // how many chunks does it take to span the width of the view
  var width = viewSize.width / cpSize.width;
  var height = viewSize.height / cpSize.height;

  // find max number of chunks we could ever need to fill the World View
  width = Math.ceil(width) + 1;
  height = Math.ceil(height) + 1;

  self.size.set(width, height);
}

}; // Beautiful.World.prototype
