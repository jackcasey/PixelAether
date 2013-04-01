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
Session.setDefault('viewChunkPosition', {
  x:0, 
  y:0,
});

var setup = function() {

  // set up our game session data
  gGame.map = Beautiful.Maps.main;
  gGame.renderer = new Beautiful.Renderer();

  // create a canvas 
  gGame.view = new Beautiful.View();
  gGame.view.setSize(600, 500);
  var canvas = gGame.view.canvas;
  var context = canvas.getContext('2d');

  // add the game canvas to the DOM
  var content = document.getElementById('content');
  content.appendChild(canvas);
  

  Deps.autorun(function() {
    gGame.renderer.renderChunk(Session.get('viewChunk'))
  });
  
  // NEXT: read mouse input from proper canvas!
  // Convert to tile correctly!
  var lastFrameTime = null;
  var draw = function() {
    gGame.view.clear();
    var mouse = gGame.view.mouse;
    context.drawImage(gGame.renderer.canvas, mouse.x, mouse.y);

    // time
    var now = new Date();
    var delta = now - lastFrameTime;
    if (delta > 50)
      console.log(1000/delta);
    lastFrameTime = now;
    window.requestAnimFrame(draw);
  };
  lastFrameTime = new Date();
  draw();
  
};

window.onload = function() {
  gGame.tileset.loadImage('elements9x3.png', setup);
};


