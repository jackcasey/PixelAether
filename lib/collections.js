// Map Chunk 
var Chunk = {} // namespace for chunk methods
var Chunks = new Meteor.Collection("chunks");
console.log('models.js:', 'loaded Chunks');

// Populate with unique data
if (Meteor.isServer) {
  Meteor.startup(function() {
  console.log('Ihe server is starting up!')
  // Create a chunk if there isn't one already
	console.log(
    Chunk.create({xCoord:0, yCoord:0})
  );

  });
};

console.log('collections.js: finished');