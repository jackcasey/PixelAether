/*------------------------------------------------------------
The Problem:
We Have a bunch of chunks. The chunks that we need to render 
will be changing frequently. Each change will introduce only
a few new chunks. We don't want to have to call setChunk
on EACH renderer every time we focus the World camera
on a new chunk -- most of the chunks we need are already
rendring.

The Solution: 
Pass a ChunkGrid the coordinate range we need. The ChunkGrid
will sort through it's collection of ChunkRenderers, leaving
the ones within our range untouched, and calling setChunk
with new coordinates on the previously obsolete Renderers.

How it works:
When the range changes, Create:
  neededRenderers - an object were the keys are the deflated 
                    names of renderers that we need, and the 
                    values are either the renderer that is 
                    currently rendering the chunk, or 'false'
                    if no renderer is currently set to render
                    this chunk.
  reuseable       - For each deflated address key in 
                    this.renderers, check if that key is in 
                    neededRenderers. If it is, add that key/
                    value pair to the reuseable object. If 
                    that renderer is not is not reuseable, 
                    push it to the dirtyRenderers list
  dirtyRenderers  - List of renderers (described above)

Iterate over a list of the keys in neededRenderers. For each
key, check if there is a re-useable render. If not, pop a 
renderer from the dirtyRenderers list, set its chunk, and
add it to the reuseable object. 

Finally, set this.renderers identifier to the reuseable object.

------------------------------------------------------------*/

Beautiful.ChunkGrid = function() {
  this.xMin = 0;
  this.xMax = 0;
  this.yMin = 0;
  this.yMax = 0;
  this.height = 1;
  this.width = 1;
  this.size = this.width * this.height;

  this.renderers = {};
}

/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.ChunkGrid.prototype = {

setXRange: function(xMin, xMax) {

  if (xMin === this.xMin && xMax === this.xMax) return;
  console.log('ChunkGrid.setXRange: new min or max', xMin, xMax);
  this.xMin = xMin;
  this.xMax = xMax;
  this.width = xMax - xMin + 1;
  this.size = this.width * this.height;

  var neededRenderers = {};
  var reuseables = {};
  var dirtyRenderers = []

  var y = 0;
  for (var x = xMin; x <= xMax; x++) {
    var addr = makeDeflatedAddr(x, y, gGame.map.name);
    var existingRenerer = this.renderers[addr]
    neededRenderers[addr] = existingRenerer || false;
  }

  // iterate over the current renderer keys, find which ones we can reuse
  var currentRendererKeys = Object.keys(this.renderers);
  var count = 0;
  for (var i = 0; i < currentRendererKeys.length; i++) {
    var key = currentRendererKeys[i];
    if (neededRenderers[key]) {
      reuseables[key] = this.renderers[key]; count++;} // can reuse
    else
      dirtyRenderers.push(this.renderers[key]) // can't reuse
  }
  console.log('Grid: Reuse Renderer Count:', count, reuseables);

  // Iterate over the needed renderers.
  var neededRendererKeys = Object.keys(neededRenderers);
  for (var i = 0; i <neededRendererKeys.length; i++) {
    var key = neededRendererKeys[i];
    var renderer = reuseables[key]
    if (!renderer) { // if we don't have a reuseable renderer, grab one from the list of dirtyRenderers
      renderer = dirtyRenderers.pop() || new Beautiful.ChunkRenderer();
      renderer.setChunk(inflateChunkAddr(key));
      reuseables[key] = renderer;
    }
    this.renderers = reuseables;
  }
},

getRenderer: function(xCoord, yCoord, mapName) {
  return this.renderers[makeDeflatedAddr(xCoord, yCoord, mapName)];
}

}; // Beautiful.ChunkGrid.prototype


/*------------------------------------------------------------
------------------------------------------------------------*/
deflateChunkAddr = function(addr) {
  if (!addr.hasOwnProperty('xCoord') || 
      !addr.hasOwnProperty('yCoord') || 
      !addr.hasOwnProperty('mapName')) return false;

  return makeDeflatedAddr(addr.xCoord, addr.yCoord, addr.mapName);
};

inflateChunkAddr = function(str) {
  var a = str.match(/(.*?)\|(.*?)\|(.*)/); // *? means match as few as possible
  if (a.length !== 4) return false;

  var addr = {
    xCoord: +a[1], // unary plus converts string in integer form to typeof number
    yCoord: +a[2], 
    mapName: a[3]
  };

  return addr;
};

makeDeflatedAddr = function(xCoord, yCoord, mapName) {
  return xCoord + '|' + yCoord + '|' + mapName;
};
