Session.setDefault('clicker', 'tree');

if (Meteor.absoluteUrl() === 'http://localhost:3000/')
  Session.set('DEBUG', true);

imageLibrary = new Beautiful.ImageLibrary;
imageLibrary.add('elements', 'elements9x3.png');
gGame = new Beautiful.Game();

var setup = function() {

  gGame.init();

  var tileset = new Beautiful.Tileset(
    'elements',
    9, 3,
    28, 35,
    30, 37 );
  gGame.world.setTileset(tileset);
  gGame.world.setMap(Beautiful.Maps.main);

  // add the game canvas to the DOM
  var canvas = gGame.view.canvas;
  var content = document.getElementById('content');
  content.appendChild(canvas);

  // resize the canvas with the browser window
  window.onresize = function(){
    var size = getWindowSize();
    gGame.view.size.set(size.width, size.height);
  };

  initKeyBindings();

  var gameLoop = function() {
    gGame.view.clear();
    gGame.world.render();
    gGame.input.step();
    gGame.simulation.step();
    window.requestAnimFrame(gameLoop);
  };

  window.requestAnimFrame(gameLoop);
};

Meteor.startup(setup);
