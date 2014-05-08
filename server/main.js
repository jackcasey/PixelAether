// Populate with unique data
Meteor.startup(function() {
  console.log('The server is starting up!');

  // static content
  createMaps();
  createTilesets();

  // Create a chunk if there isn't one already

  // allow subscription to a range of chunks
  Meteor.publish('map', function(xMin, xMax, yMin, yMax, mapName) {
    xMin = xMin || -1;
    xMax = xMax || 1;
    yMin = yMin || -1;
    yMax = yMax || 1;
    mapName = mapName || 'main';

    var cursor = Chunks.find({
      cx:{$gte:xMin, $lte:xMax},
      cy:{$gte:yMin, $lte:yMax},
      mapName: mapName
    });

    // Create the requested chunks if necessary
    var size =  (xMax - xMin + 1) * (yMax - yMin + 1);
    if (cursor.count() != size) {
      for (var x = xMin; x <= xMax; x++) {
        for (var y = yMin; y <= yMax; y++) {
          var selector = {cx:x, cy:y, mapName: mapName};
          if (!Chunks.findOne(selector)) {
            console.log('Create New Chunk:', selector);
            Chunks.create(selector);
          }
        }
      }
    }

    return cursor;
  });

});

  