Maps = new Meteor.Collection(null, {});

/*------------------------------------------------------------
{ name: 'main',
  tilesetName: 'elements',
  chunkWidth: 16,
  chunkHeight: 16 }
------------------------------------------------------------*/
Maps.create = function(options) {
  var map = {
    name: options.name,
    tilesetName: options.tilesetName,
    chunkWidth: options.chunkWidth,
    chunkHeight: options.chunkHeight
  };
  Maps.upsert(
    {name:options.name},
    map
  );
};
