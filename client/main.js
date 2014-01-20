// polyfill requestAnimationFrame
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

Session.setDefault('clicker', 'tree');

if (Meteor.absoluteUrl() === 'http://localhost:3000/')
  Session.set('DEBUG', true);


var setup = function() {

  gGame = new Beautiful.Game();
  gGame.init();

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
