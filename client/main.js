// get the appropriate requestAnimationFrame function,
// store it in the window object
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// HACK
function treeClicker(tileXY) {
  var selector = {
    xCoord:gGame.world.camera.xCoord,
    yCoord:gGame.world.camera.yCoord,
    mapName: gGame.world.getMap().name
  };
  console.log('Click Map Selector:', selector);
  var chunk = Chunks.findOne(selector) 
  var tileIndex = (chunk.width * tileXY.y) + tileXY.x;
  var tileValue = chunk.layerData.plant[tileIndex];
  tileValue = (tileValue === 1) ? 0 : 1; // if it's a tree, make it nothing. else, make it a tree
  Meteor.call('setTile', selector, tileXY.x, tileXY.y, tileValue, 'plant');
};

images = {}; // HACK (low quality image manager);
var filenames = ['elements9x3.png'];
var loadedImageCount = 0;

for (var i = 0; i < filenames.length; i++) {
  var image = new Image();
  var filename = filenames[i];
  images[filename] = image;

  // call setup if we are ready
  image.onload = function() {
    loadedImageCount++;
    if (loadedImageCount >= filenames.length) {
      setup();
    }
  };
  image.src = filename;
};

var setup = function() {

  gGame = new Beautiful.Game();
  gGame.init();

  // add the game canvas to the DOM
  var canvas = gGame.view.canvas;
  var content = document.getElementById('content');
  content.appendChild(canvas);

  gGame.input.bind(
    gGame.input.KEY.SPACE,
    'fire');

  gGame.input.bind(
    gGame.input.KEY.MOUSE2,
    'world');

  gGame.input.bind(
    gGame.input.KEY.MOUSE1,
    'build');


  var gameLoop = function() {
    gGame.view.clear();
    gGame.world.render();

    var i = gGame.input;

    // for testing
    if (i.tap('fire')) console.log('fire!!');

    // simulation to world coords
    if (i.up('build')) {
      var tileXY = gGame.world.simToWorld(i.mouse.simPos);
      console.log(tileXY);
      treeClicker(tileXY);
    }
    // move camera
    if (i.drag('world')) {
      var delta = i.mouse.deltaPos;
      gGame.world.moveCamera({x: -delta.x, y: -delta.y});
    }

    gGame.simulation.step();
    window.requestAnimFrame(gameLoop);
  };

  window.requestAnimFrame(gameLoop);
};


