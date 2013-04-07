/*------------------------------------------------------------
The Problem:
We Have a bunch of chunks. The chunks that we need to render 
will be changing frequently. Each change will introduce only 
a few new chunks, We don't want to have to call
renderChunk on EACH chunk every time we focus the World camera 
on a new chunk -- we already have most of the chunks that we
need. 

The Solution: 
Pass a ChunkGrid the coordinate range we need. The ChunkGrid 
will sort through it's collection of ChunkRenderers, leaving
the ones within our range untouched, and calling setChunk
with new coordinates on the previously obsolete Renderers. 

add a method that gets the renderer within the range, given 
xCoord, yCoord values
------------------------------------------------------------*/

Beautiful.ChunkGrid = function() {

}

/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.ChunkGrid.prototype = {

}

deflateChunkAddr = function(addr) {
  if (!addr.hasOwnProperty('xCoord') || 
      !addr.hasOwnProperty('yCoord') || 
      !addr.hasOwnProperty('mapName')) return false;
    
  return addr.xCoord + '|' + addr.yCoord + '|' + addr.mapName;
}

inflateChunkAddr = function(str) {
  var a = str.match(/(.*?)\|(.*?)\|(.*)/); // *? means match as few as possible
  if (a.length !== 4) return false;

  return {
    xCoord: +a[1], // unary plus converts string in the form of integer to typeof number
    yCoord: +a[2], 
    mapName: a[3]
  };
}