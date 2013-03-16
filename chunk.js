/*------------------------------------------------------------
Create a new map chunk, insert it into chunks collection

chunkId     - mongodb style chunk identifier 
layerNames  - optional array of layer names, default ['ground', 'plant']
------------------------------------------------------------*/
Chunk.create = function(chunkId, layerNames) {

  chunkId.mapName = chunkId.mapName || 'main';

  // verify that the chunkId specifies a location
  if (!(isInt(chunkId.xCoord) && isInt(chunkId.yCoord)))
    return false, 'Chunk.create error: chunkId must specify xCoord and yCoord';

  // veryfy that it doesn't already exist
  var chunk = Chunks.findOne(chunkId);
  if (chunk) 
    return false, 'Chunk.create: Chunk exists, not creating - ' + chunkId.mapName + ' ' + chunkId.xCoord + ', ' + chunkId.yCoord;

  // build the chunk
  chunk = {
    mapName:    chunkId.mapName, 
    xCoord:     chunkId.xCoord, 
    yCoord:     chunkId.yCoord, 
    width:      16, 
    height:     16,
    layerNames: layerNames || ['ground', 'plant'],
    layerData:  {}
  };

  console.log('new chunk', chunk) // delete me
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


/*------------------------------------------------------------
Edit a single tile in the chunk identified by chunkId
TODO: Broken!

THIS WORKS:
   Chunks.update({xCoord:0}, {$set:{'layerData.plant.29':12}})
db.chunks.update({xCoord:0}, {$set:{'layerData.plant.29':12}})
------------------------------------------------------------*/
Chunk.setTile = function (chunkId, x, y, i, layerName) {
  chunkId.mapName = chunkId.mapName || 'main';
  layerName = layerName || 'ground';

  if (x >= this.width || y >= this.height ) 
    return false, 'Chunk.setTile: Fail! x or y out of bounds!';

  if (typeof i !== 'number')
    return false, 'Chunk.setTile: Fail! Index is not a number!';

  // TODO: don't use chunk.tiles.! no longer correct 
  chunk.tiles[y * chunk.width + x] = Math.floor(i);

  var tileIndex = y * 16 + x; // TODO: use chunk width!

  var setOptions = {$set:{}};
  setOptions.$set['tiles.' + tileIndex] = i;
  Chunks.update({xCoord:0, yCoord:0, }, setOptions);
};

