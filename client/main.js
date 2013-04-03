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

// Location where the user is currently looking. 
Session.setDefault('viewChunk', {
  mapName:'main', 
  xCoord:0,
  yCoord:0, 
});

var setup = function() {

  // set up our game session data
  gGame.map = Beautiful.Maps.main;
  gGame.chunkRenderer = new Beautiful.ChunkRenderer();

  // create a canvas 
  gGame.view = new Beautiful.View();
  gGame.view.setSize(1000, 600);
  var canvas = gGame.view.canvas;
  var context = canvas.getContext('2d');

  // add the game canvas to the DOM
  var content = document.getElementById('content');
  content.appendChild(canvas);
  
  // HACK
  Deps.autorun(function() {
    gGame.chunkRenderer.renderChunk(Session.get('viewChunk'))
  });
  
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
    'edit');

  gGame.input.bind(
    gGame.input.KEY.MOUSE1,
    'build');


  var gameLoop = function() {
    gGame.view.clear();
    gGame.view.drawRenderer(gGame.chunkRenderer, 0, 0);

    var i = gGame.input;

    if (i.tap('fire')) console.log('fire!!');
    if (i.hold('edit')) console.log('holding rmb');
    if (i.drag('build')) console.log('drag', i.mouse.deltaPos);

    gGame.simulation.step();
    window.requestAnimFrame(gameLoop);
  };

  window.requestAnimFrame(gameLoop);
};

window.onload = function() {
  gGame.tileset.loadImage('elements9x3.png', setup);
};


