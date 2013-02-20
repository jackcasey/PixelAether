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
  var tileSet = Beautiful.tileSet;

  var chunk = Chunks.find({x:0, y:0}).fetch()[0];
  console.log('TILES', chunk);

  if (!chunk || !chunk.tiles) {
    console.log('main.js: onImageLoad: no chunk!');
    return;
  };
  console.log('chunk', chunk);
  console.log('!chunk', !chunk);
  console.log('chunk.tiles', chunk.tiles);
  console.log('length', chunk.tiles.length);

  for (var i=0; i < Beautiful.chunk.width * Beautiful.chunk.height; i++) {

    //var tileIndex = tileSet.validIndexes[Math.floor( (Math.random()*tileSet.validIndexes.length) )];
    var tileIndex = chunk.tiles[i];

    xClip = tileSet.getUpperLeftX(tileIndex % 27);
    yClip = tileSet.getUpperLeftY(tileIndex % 27);
    xCursor = tileSet.tileWidth * (i % Beautiful.chunk.width);
    yCursor = tileSet.tileHeight * (Math.floor(i / Beautiful.chunk.width));

    Beautiful.canvasContext.drawImage(tileSet.image, 
      xClip, yClip, 
      tileSet.tileWidth, tileSet.tileHeight, 
      xCursor, yCursor, 
      tileSet.tileWidth, tileSet.tileHeight);
  }; // for loop
};


// Phone book for all our objects that need to be used in many places
var Beautiful = {};

Beautiful.canvas = null;
Beautiful.canvasContext = null;

var setup = function() {
  // Create the canvas/context for our game
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  canvas.setAttribute('width', 500);
  canvas.setAttribute('height', 700);

  // save the canvas and context in our service locator object
  Beautiful.canvas = canvas;
  Beautiful.canvasContext = context;

  // chunk specification. VERY temporary
  Beautiful.chunk = {
    height: 16,
    width: 16,
    x: 0,
    y: 0,
    map: null,
    tiles: new Array(256)
  }

  // now let's set up the tileSet
  // for now, let's just have a single tileSet
  var tileSet =  new TileSet( 
    9, 3, 
    28, 35, 
    30, 37,
    [0, 9, 10, 11, 12, 13, 14, 15, 16, 17]
  );
  Beautiful.tileSet = tileSet;
  tileSet.loadImage('elements9x3.png', onImageLoad);
};

var f = function(){console.log('Calling "f"', Chunks.find({x:0}).tiles[0]);};

window.onload = setup;
Meteor.autorun(onImageLoad);

