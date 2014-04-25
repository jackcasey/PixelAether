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
  if (!(isInt(chunkId.xCoord) && isInt(chunkId.yCoord)))
    return [false, 'Chunk.create error: chunkId must specify xCoord and yCoord'];

  // verify that there is a map with this name
  if (typeof map === 'undefined')
    return [false, 'Chunk.create error: chunkId.mapName is not a Map:', chunkId.mapName];

  // verify that it doesn't already exist
  var chunk = Chunks.findOne(chunkId);
  if (chunk) 
    return [false, 'Chunk.create: Chunk exists, not creating - ' + chunkId.mapName + ' ' + chunkId.xCoord + ', ' + chunkId.yCoord];


  // build the chunk
  chunk = {
    mapName:    chunkId.mapName, 
    xCoord:     chunkId.xCoord, 
    yCoord:     chunkId.yCoord, 
    width:      map.chunkWidth,
    height:     map.chunkHeight,
    layerNames: layerNames || ['ground', 'plant'],
    layerData:  {}
  };

  var size = chunk.width * chunk.height;

  // build the chunk layers
  for (var i = 0; i < chunk.layerNames.length; i++) {
    var layerName = chunk.layerNames[i];
    var data = new Array(size);

    // populate layerData
    for (var j = 0; j < size; j++) {
      if (layerName === 'plant') {
        data[j] = 1; // 1 = tree
      } 
      else { 
        data[j] = 10; // 10 = grass
      }
    } // populate layer data loop

    chunk.layerData[layerName] = data;
  } // iterate over layers

  Chunks.insert(chunk);
};