/*------------------------------------------------------------
------------------------------------------------------------*/
Maps = new Meteor.Collection(null, {
  transform: function(map){
    _.extend(map, prototype);
    return map;
  }
});

Maps.create = function(options) {
  var map = {
    name: options.name,
    tilesetName: options.tilesetName,
    chunkWidth: options.chunkWidth, 
    chunkHeight: options.chunkHeight
  };
  Maps.insert(map);
};

var prototype = {
};

/*------------------------------------------------------------
Static Content
------------------------------------------------------------*/
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
