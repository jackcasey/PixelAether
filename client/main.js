Session.setDefault('clicker', 'tree');

if (Meteor.absoluteUrl() === 'http://localhost:3000/')
  Session.set('DEBUG', true);

Tilesets.create({
  name:'elements',
  imageName:'elements',
  width: 9, 
  height: 3, 
  tileWidth: 28,
  tileHeight: 35,
  cellWidth: 30, 
  cellHeight: 37
});

imageLibrary = new Beautiful.ImageLibrary;
imageLibrary.add('elements', 'elements9x3.png');
imageLibrary.add('characters', 'characters5x1.png');
gGame = new Beautiful.Game();

var setup = function() {

  gGame.init();

  gGame.world.setTileset({name: 'elements'});
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
