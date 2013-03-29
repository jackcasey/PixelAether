var setup = function() {

  // set up our game session data
  gGame.map = Beautiful.Maps.main;
  gGame.renderer = new Beautiful.Renderer();

  // create a canvas 
  var canvas = document.createElement('canvas');
  var content = document.getElementById('content');
  content.appendChild(canvas);

  gGame.tileset.loadImage('elements9x3.png', 
    function() {
      Deps.autorun(function(){gGame.renderer.renderChunk({xCoord:0, yCoord:0});});
    }
  );

  

  
};


window.onload = setup;


