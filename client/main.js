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

Session.setDefault('clicker', 'tree');

// HACK
function treeClicker(worldPos) {
  var selector = {
    xCoord: worldPos.xCoord,
    yCoord: worldPos.yCoord,
    mapName: gGame.world.getMap().name
  };
  console.log('Click Map Selector:', selector);
  var chunk = Chunks.findOne(selector);
  if (!chunk) return;
  var tileIndex = (chunk.width * worldPos.y) + worldPos.x;
  if (Session.get('clicker') === 'tree') {
    var tileValue = chunk.layerData.plant[tileIndex];
    tileValue = (tileValue === 1) ? 0 : 1; // if it's a tree, make it nothing. else, make it a tree
  }
  else if (Session.get('clicker') === 'water') {
    var tileValue = chunk.layerData.ground[tileIndex];
    tileValue = (tileValue === 11) ? 10 : 11;
  }
  else if (Session.get('clicker') === 'path') {
    var tileValue = chunk.layerData.ground[tileIndex];
    tileValue = (tileValue === 16) ? 10 : 16;
  }
  else return;

  Meteor.call('setTile', selector, worldPos.x, worldPos.y, tileValue, 
    (Session.get('clicker') === 'tree')? 'plant' : 'ground');
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

  window.onresize = function(){
    var size = getWindowSize();
    gGame.view.size.set(size.width, size.height);
  };

  var gameLoop = function() {
    gGame.view.clear();
    gGame.world.render();

    var i = gGame.input;

    // for testing
    if (i.tap(gGame.input.KEY.SPACE)) console.log('fire!!');

    // simulation to world coords
    if (i.up(gGame.input.KEY.MOUSE1)) {
      var worldPos = gGame.world.simToWorld(i.mouse.simPos);
      treeClicker(worldPos);
    }
    // move camera
    if (i.drag(gGame.input.KEY.MOUSE2)) {
      var delta = i.mouse.deltaPos;
      gGame.world.moveCamera({x: -delta.x, y: -delta.y});
    }

    if (i.up(gGame.input.KEY.T)) {
      Session.set('clicker', 'tree');
    }
    if (i.up(gGame.input.KEY.W)) {
      Session.set('clicker', 'water');
    }
    if (i.up(gGame.input.KEY.P)) {
      Session.set('clicker', 'path');
    }

    gGame.simulation.step();
    window.requestAnimFrame(gameLoop);
  };

  window.requestAnimFrame(gameLoop);
};


