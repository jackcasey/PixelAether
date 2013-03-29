// Boilerplate from the sample project
Template.hello.greeting = function () {
  return "Welcome to beautiful.";
};

Template.hello.events({
  'click input' : function () {
  // template data, if any, is available in 'this'
  if (typeof console !== 'undefined')
    console.log("You pressed the button");
  }
});


Beautiful.renderer = {};


var setup = function() {
  // Create the canvas/context for our game
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  gGame.renderer = new Beautiful.Renderer(canvas);

  gGame.tileset.loadImage('elements9x3.png', 
    function(){
      gGame.renderer.renderChunk({xCoord:0, yCoord:0});
    }
  );

  Deps.autorun(function(){gGame.renderer.renderChunk({xCoord:0, yCoord:0});});
};


window.onload = setup;


