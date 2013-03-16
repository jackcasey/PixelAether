// Populate with unique data
Meteor.startup(function() {
  console.log('The server is starting up!')
  // Create a chunk if there isn't one already
  console.log('Checking for initial data...',
    Chunk.create({xCoord:0, yCoord:0})
  );
});
