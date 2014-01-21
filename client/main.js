Session.setDefault('clicker', 'tree');

if (Meteor.absoluteUrl() === 'http://localhost:3000/')
  Session.set('DEBUG', true);


var setup = function() {

  var tileset = new Beautiful.Tileset(
    imageLibrary.images['elements9x3.png'],
    9, 3,
    28, 35,
    30, 37 );

  gGame = new Beautiful.Game();
  gGame.init();

  gGame.world.setMap(Beautiful.Maps.main);
  gGame.world.setTileset(tileset);

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

imageLibrary = new Beautiful.ImageLibrary;
imageLibrary.load('elements9x3.png', setup);
