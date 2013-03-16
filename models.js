

// Meteor.methods({
//   getChunk: function(x, y, map){

//   },
// });

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

- Layers (Don't implement this until I actually need it)
  - name [ground, plant, ]
  - tileSetName

- GameObjects

Permissions
- Chunk
  - publish
    - publish all chunks
  - allow
    - create - only on the server
    - update - for now, anyone
    - destroy - no one




*/