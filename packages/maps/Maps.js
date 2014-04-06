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
