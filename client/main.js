Session.setDefault('clicker', 'tree');

if (Meteor.absoluteUrl() === 'http://localhost:3000/')
  Session.set('DEBUG', true);

imageLibrary = new Beautiful.ImageLibrary;
imageLibrary.add('elements', 'elements9x3.png');
imageLibrary.add('characters', 'characters5x1.png');
gGame = new Beautiful.Game();

// static content
createTilesets();
createMaps();

var setup = function() {

  gGame.init();
  gGame.world.perspective.setTileset(Tilesets.findOne({name:'elements'}));
  gGame.world.perspective.setMap(Maps.findOne({name:'main'}));

  // add the game canvas to the DOM
  var canvas = gGame.world.view.canvas;
  var content = document.getElementById('content');
  content.appendChild(canvas);

  // resize the canvas with the browser window
  window.onresize = function(){
    var size = getWindowSize();
    gGame.world.view.size.set(size.width, size.height);
  };

  initKeyBindings();

  var gameLoop = function() {
    gGame.world.view.clear();
    gGame.world.perspective.render();
    gGame.input.step();
    gGame.simulation.step();
    window.requestAnimFrame(gameLoop);
  };

  window.requestAnimFrame(gameLoop);
};

Meteor.startup(setup);
