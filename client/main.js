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


