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


var setup = function() {

  gGame.renderer = new Beautiful.Renderer();

  var content = document.getElementById('content');
  content.appendChild(gGame.renderer.canvas);

  gGame.tileset.loadImage('elements9x3.png', 
    function(){
      gGame.renderer.renderChunk({xCoord:0, yCoord:0});
    }
  );

  Deps.autorun(function(){gGame.renderer.renderChunk({xCoord:0, yCoord:0});});
};


window.onload = setup;


