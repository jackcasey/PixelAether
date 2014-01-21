/*------------------------------------------------------------
Game wraps instances of all the major building blocks of 
our game engine. 
Many objects expect there to be a single instance of Game in 
the global namepsace with the name 'self'. 

self.world
self.simulation
self.input
self.view

Some of the members above require gGame to exist before they 
can initialize. For that reason, First allow us to create the 
gGame object, THEN run the init method on it to actually 
create the members. 
------------------------------------------------------------*/
Beautiful.Game = function() {
};


/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.Game.prototype = {

init: function() {
  var self = this;
  var windowSize = getWindowSize();
  self.view = new Beautiful.View(); // wraps our DOM canvas
  self.view.size.set(windowSize.width, windowSize.height);
  self.world = new Beautiful.World(); // Wraps chunkRenderers
  self.simulation = new Beautiful.Simulation(); // simulate game time
  self.simulation.step();
  self.input = new Beautiful.Input(); // input depends on Simulation

  // WARNING: if init is called twice, two autoruns will be created
  Deps.autorun(function() {
    var range = self.world.grid.getRange();
    var map = self.world.getMap();
    if (!map) return;

    Meteor.subscribe('map',
      range.xMin - 1,
      range.xMax + 1,
      range.yMin - 1,
      range.yMax + 1,
      map.name);
  });
}
  //setTileset
};
