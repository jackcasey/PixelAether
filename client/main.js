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

Session.set('chunkSelector', {xCoord: 0, yCoord:0, mapName:'main'});

// HACK
function treeClicker(tileXY) {
  var selector = Session.get('chunkSelector');
  var chunk = Chunks.findOne(selector) 
  var tileIndex = (chunk.width * tileXY.y) + tileXY.x;
  var tileValue = chunk.layerData.plant[tileIndex];
  tileValue = (tileValue === 1) ? 0 : 1; // if it's a tree, make it nothing. else, make it a tree
  Meteor.call('setTile', selector, tileXY.x, tileXY.y, tileValue, 'plant');
}


var setup = function() {

  // set up our game session data
  gGame.map = Beautiful.Maps.main;

  // create View for our game, wrapping the main HTML5 canvas 
  gGame.view = new Beautiful.View();
  gGame.view.setSize(1000, 600);
  var canvas = gGame.view.canvas;
  var context = canvas.getContext('2d');

  // add the game canvas to the DOM
  var content = document.getElementById('content');
  content.appendChild(canvas);

  // Wraps chunkRenderers 
  gGame.world = new Beautiful.World();
  
  // global data about our simulation
  gGame.simulation = new Beautiful.Simulation();
  gGame.simulation.step();

  // now that we have a simulation, we can set up input
  gGame.input = new Beautiful.Input();
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

window.onload = function() {
  gGame.tileset.loadImage('elements9x3.png', setup);
};


