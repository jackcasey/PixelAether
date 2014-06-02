/*------------------------------------------------------------
Create a new map chunk, insert it into chunks collection

chunkId     - mongodb style selector 
layerNames  - optional array of layer names, default ['ground', 'plant']

Assume:
  Maps collection contains a map with .name  === chunkId.name
------------------------------------------------------------*/
Chunks.create = function(chunkId, layerNames) {

  chunkId.mapName = chunkId.mapName || 'main';
  var map = Maps.findOne({name:chunkId.mapName});

  // verify that the chunkId specifies a location
  if (!(isInt(chunkId.cx) && isInt(chunkId.cy)))
    return [false, 'Chunk.create error: chunkId must specify cx and cy'];

  // verify that there is a map with this name
  if (typeof map === 'undefined')
    return [false, 'Chunk.create error: chunkId.mapName is not a Map:', chunkId.mapName];

  // verify that it doesn't already exist
  var chunk = Chunks.findOne(chunkId);
  if (chunk) 
    return [false, 'Chunk.create: Chunk exists, not creating - ' + chunkId.mapName + ' ' + chunkId.cx + ', ' + chunkId.cy];


  // build the chunk
  chunk = {
    mapName:    chunkId.mapName,
    cx:         chunkId.cx,
    cy:         chunkId.cy,
    width:      map.chunkWidth,
    height:     map.chunkHeight,
    layerNames: layerNames || ['ground', 'plants'],
  };

  var size = chunk.width * chunk.height;

  // build the chunk layers
  for (var i = 0; i < chunk.layerNames.length; i++) {
    var layerName = chunk.layerNames[i];
    var data = new Array(size);

    // populate layers
    for (var j = 0; j < size; j++) {
      if (layerName === 'plants') {
        data[j] = 1; // 1 = tree
      } 
      else { 
        data[j] = 10; // 10 = grass
      }
    } // populate layer data loop

    chunk[layerName] = data;
  } // iterate over layers

  Chunks.insert(chunk);
};
