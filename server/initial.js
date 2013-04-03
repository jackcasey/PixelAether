// Populate with unique data
Meteor.startup(function() {
  console.log('The server is starting up!');
  // Create a chunk if there isn't one already
  for (var y = -5; y < 5; y++) {
    for (var x = -5; x < 5; x++) {
      console.log(
        'Creating chunk if it doesn\'t exist:', x, y,
        Chunk.create({xCoord:x, yCoord:y})
      );
    }
  }
});
