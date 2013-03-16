// Populate with unique data
Meteor.startup(function() {
  console.log('The server is starting up!')
  // Create a chunk if there isn't one already
  console.log(
    Chunk.create({xCoord:0, yCoord:0})
  );
});
