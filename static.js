createTilesets = function(){
  Tilesets.create({
    name:'elements',
    imageName:'elements',
    width: 9,
    height: 3,
    tileWidth: 28,
    tileHeight: 35,
    cellWidth: 30,
    cellHeight: 37
  });

  Tilesets.create({
    name:'characters',
    imageName:'characters',
    width: 5,
    height: 1,
    tileWidth: 28,
    tileHeight: 35,
    cellWidth: 30,
    cellHeight: 37
  });
};

createMaps = function(){
  Maps.create({
    name: 'main',
    tilesetName: 'elements',
    chunkWidth: 16,
    chunkHeight: 16
  });

  Maps.create({
    name: 'second',
    tilesetName: 'elements',
    chunkWidth: 16,
    chunkHeight: 8
  });
};
