// Boilerplate from the sample project
Template.hello.greeting = function () {
  return "Welcome to beautiful.";
};

Template.hello.events({
  'click input' : function () {
  // template data, if any, is available in 'this'
  if (typeof console !== 'undefined')
    console.log("You pressed the button");
  }
});

var onImageLoad = function(){
  // Where are we taking from the image
  var xClip;
  var yClip;

  //Where do we position the tiles on the canvas
  var xCursor = 0;
  var yCursor = 0;

  // for convenience
  var tileset = Beautiful.tileset;
  var tilesetSize = tileset.width * tileset.height;

  var chunk = Chunks.find({xCoord:0, yCoord:0}).fetch()[0];
  if (!chunk) return;

  // iterate over layers
  for (var layerIndex = 0; layerIndex < chunk.layerNames.length; layerIndex++) {
    var layerName = chunk.layerNames[layerIndex];

    // iterate over layer Data
    for (var i=0; i < chunk.width * chunk.height; i++) {
      var tileIndex = chunk.layerData[layerName][i];

      if (!tileIndex) continue;

      // Get the coordinates of the tile in the tileset
      tileIndex = tileIndex - tileset.firstgid;
      xClip = tileset.getUpperLeftX(tileIndex % tilesetSize); 
      yClip = tileset.getUpperLeftY(tileIndex % tilesetSize);
      xCursor = tileset.tileWidth * (i % chunk.width);
      yCursor = tileset.tileHeight * (Math.floor(i / chunk.width));

      Beautiful.canvasContext.drawImage(tileset.image,
        xClip, yClip,
        tileset.tileWidth, tileset.tileHeight,
        xCursor, yCursor,
        tileset.tileWidth, tileset.tileHeight);

    } // iterate over layer data
  } // iterate over layers
};


Beautiful.canvas = null;
Beautiful.canvasContext = null;


var setup = function() {
  // Create the canvas/context for our game
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  bCanvas = new Beautiful.Renderer(canvas);

  // save the canvas and context in our service locator object
  Beautiful.canvas = canvas;
  Beautiful.canvasContext = context;

  Beautiful.tileset.loadImage('elements9x3.png', onImageLoad);
};


window.onload = setup;
Deps.autorun(onImageLoad);

