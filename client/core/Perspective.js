/*------------------------------------------------------------
Render a map to the view, manage map subscriptions

Keeps Track of
  Map position the Camera is centered on
  perspective.size - max number of chunks that could be rendered
  Range of chunks to render given the view, chunkPixelSize
  Current tileset and current map

Creates a .grid which keeps track of
  Which chunks are we currently rendering
  Where on the view we should render chunks to
------------------------------------------------------------*/
Beautiful.Perspective = function(view) {
  var self = this;

  if (! view instanceof Beautiful.View)
    throw new Error("view is not an instance of Beautiful.View");
  self._view = view;

  self._tilesetDep = new Deps.Dependency;
  self._mapDep = new Deps.Dependency;

  self.chunkPixelSize = new Beautiful.Size2D;
  self.size = new Beautiful.Size2D;

  self.camera = {
    cx: 0,
    cy: 0,
    px: 0,
    py: 0 };

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
worldToSim
------------------------------------------------------------*/
Beautiful.Perspective.prototype = {

getMap: function() {
  this._mapDep.depend();
  return this._map;
},

getTileset: function() {
  this._tilesetDep.depend();
  if (this._tileset && this._tileset.image) {
    // indicate dependency
    imageLibrary.get(this._tileset.imageName);
  }
  return this._tileset;
},

moveCamera: function(deltaXY) {
  var newX = this.camera.px += deltaXY.x;
  var newY = this.camera.py += deltaXY.y;

  var cpSize = this.chunkPixelSize.get();
  var cpCenter = this.chunkPixelSize.getCenter();

  var changedChunk = false;
  // check if the camera is no longer looking over the chunk
  var checkX = newX + cpCenter.x;
  if (checkX >= cpSize.width) {
    this.camera.px -= cpSize.width;
    this.camera.cx += 1;
    changedChunk = true;
  }
  else if (checkX < 0) {
    this.camera.px += cpSize.width;
    this.camera.cx -= 1;
    changedChunk = true;
  }

  var checkY = newY + cpCenter.y;
  if (checkY >= cpSize.height) {
    this.camera.py -= cpSize.height;
    this.camera.cy += 1;
    changedChunk = true;
  }
  else if (checkY < 0) {
    this.camera.py += cpSize.height;
    this.camera.cy -= 1;
    changedChunk = true;
  }

  if (changedChunk) {
    console.log('Perspective.js - camera:', this.camera);
  }
},

// render to this._view
render: function() {

  Deps.flush();

  var cpSize = this.chunkPixelSize.get();
  var cpCenter = this.chunkPixelSize.getCenter();
  var viewCenter = this._view.size.getCenter();
  var map = this.getMap();
  var size = this.size.get();

  // the distance between the camera and the left edge of the center tile
  var xOffsetCamera = this.camera.px + cpCenter.x;
  var yOffsetCamera = this.camera.py + cpCenter.y;
  // the distance between the edge of the chunk and the edge of the screen
  var xOffsetCenterChunk = viewCenter.x - xOffsetCamera;
  var yOffsetCenterChunk = viewCenter.y - yOffsetCamera;
  // how many chunks do we render to the left of this one?
  var chunksToLeft = Math.ceil(xOffsetCenterChunk / cpSize.width);
  var chunksBelow = Math.ceil(yOffsetCenterChunk / cpSize.height);
  // where do we position our first chunk
  var xStart = -this.camera.px - (cpSize.width * chunksToLeft);
  var yStart = -this.camera.py - (cpSize.height * chunksBelow);
  // what is the cx of our left most chunk?
  var cxLeft = this.camera.cx - chunksToLeft;
  var cxRight = cxLeft + size.width - 1;

  var cyBottom = this.camera.cy - chunksBelow;
  var cyTop = cyBottom + size.height - 1;

  this.grid.setRange(cxLeft, cxRight, cyBottom, cyTop);
  var xCursor = xStart;
  var yCursor = yStart;

  for (var cy = cyBottom; cy <= cyTop; cy++) {
    for (var cx = cxLeft; cx <= cxRight; cx ++) {
      var renderer = this.grid.getRenderer(cx, cy, map.name);
      this._view.drawRenderer(renderer, xCursor, yCursor);
      xCursor += cpSize.width;
    } // cx for loop
    yCursor += cpSize.height;
    xCursor = xStart;
  } // cy for loop
},

setMap: function(map) {
  if (this._tileset && map.tilesetName !== this._tileset.name)
    this.setTileset(Tilesets.findOne({name:map.tilesetName}));
  if (map !== this._map){
    this._map = map;
    this._mapDep.changed();
  }
},

setTileset: function(tileset) {
  this._tileset = tileset;
  this._tilesetDep.changed();
},

simToWorld: function(xy) {
  var tileset = this.getTileset();
  var cpCenter = this.chunkPixelSize.getCenter();
  var map = this.getMap();
  var pixelX = xy.x + this.camera.px + cpCenter.x;
  var pixelY = xy.y + this.camera.py + cpCenter.y;
  var tileX = Math.floor(pixelX / tileset.tileWidth);
  var tileY = Math.floor(pixelY / tileset.tileHeight);
  var ans = {
    cx: this.camera.cx + Math.floor(tileX / map.chunkWidth),
    cy: this.camera.cy + Math.floor(tileY / map.chunkHeight),
    tx: tileX % map.chunkWidth,
    ty: tileY % map.chunkHeight
  };
  if (ans.tx < 0) ans.tx += map.chunkWidth;
  if (ans.ty < 0) ans.ty += map.chunkHeight;
  return ans;
},

updateSize: function(){
  var self = this;
  var cpSize = self.chunkPixelSize.get();
  var viewSize = this._view.size.get();

  // how many chunks does it take to span the width of the view
  var width = viewSize.width / cpSize.width;
  var height = viewSize.height / cpSize.height;

  // find max number of chunks we could ever need to fill the View
  width = Math.ceil(width) + 1;
  height = Math.ceil(height) + 1;

  self.size.set(width, height);
},

worldToSim: function(addr){
  var cpSize = this.chunkPixelSize.get();
  var tileset = this.getTileset();

  // if addr has tx instead of px
  if (typeof addr.px !== 'number'){
    var tCenterX = tileset.tileWidth * 0.5;
    var tCenterY = tileset.tileHeight * 0.5;
    addr.px = (addr.tx * tileset.tileWidth) + tCenterX - cpSize.centerX;
    addr.py = (addr.ty * tileset.tileHeight) + tCenterY - cpSize.centerY;
  }

  var newPx = (addr.px - this.camera.px);
  var newPy = (addr.py - this.camera.py);
  // if camera and addr are on the same chunk, we are done
  newPx += cpSize.width * (addr.cx - this.camera.cx);
  newPy += cpSize.height * (addr.cy - this.camera.cy);

  return {
    x: newPx,
    y: newPy
  };
}

}; // Beautiful.Perspective.prototype
