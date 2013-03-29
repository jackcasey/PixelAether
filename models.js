/* 
Elements
- Chunk
  - mapName
  - width, height
  - xCoord (within Map)
  - yCoord (within Map)
  - layerNames [array of names]
  - layers {layerName: [data0, data1, ...] }

- TileSet
  - name
  - imagePath
  - imageWidth, Height
  - cellWidth, Height
  - tileWidth, Height
  - width, height

- Map
  - name
  - chunkWidth
  - chunkHeight

- Layers (Don't implement this until I actually need it!!)
  - name [ground, plant, ]
  - tileSetName

- GameObjects

Permissions
- Chunk
  - publishings
    - publish all chunks
  - allow
    - create - only on the server
    - update - for now, anyone
    - destroy - no one

- Map

- TileSet
  - publishings
    - publish all tilesets
  - permissions 
    - permit nothing
*/


Meteor.methods ({

  /*------------------------------------------------------------
  Edit a single tile in the chunk, identified by chunkId

  Chunks.update({xCoord:0}, {$set:{'layerData.plant.29':12}})
  Chunks.update({xCoord:0}, {$set:{'layerData.<layerName>.<tileIndex>':<tilesetIndex>}})
  ------------------------------------------------------------*/
  setTile: function (chunkId, x, y, i, layerName) {

    // default values save testing time
    chunkId = chunkId || {xCoord:0, yCoord:0};
    chunkId.mapName = chunkId.mapName || 'main';
    layerName = layerName || 'ground';

    // get the chunk height and width. If this is too slow, we can cache it
    var chunk = Chunks.findOne(chunkId, {width: true, height: true});

    // sanity check x, y, i
    if (x >= chunk.width || y >= chunk.height ) 
      return false, 'Chunk.setTile: Fail! x or y out of bounds!';

    if (typeof i !== 'number')
      return false, 'Chunk.setTile: Fail! Index is not a number!';

    var tileIndex = y * chunk.width + x; // convert xy to index

    var setOptions = {$set:{}};
    setOptions.$set['layerData.' + layerName + '.' + tileIndex] = i; 

    // everything except the Chunks.update call can probably  be done on the client side
    Chunks.update(chunkId, setOptions); // what happens when layerName does not exist?
  },
});