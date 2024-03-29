/*------------------------------------------------------------
Game wraps instances of all the major building blocks of 
our game engine. 

self.simulation
self.input
self.world
------------------------------------------------------------*/
Beautiful.Game = function() {
};


/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.Game.prototype = {

init: function() {
  var self = this;
  self.world = new Beautiful.World();
  self.simulation = new Beautiful.Simulation(); // simulate game time
  self.simulation.step();
  self.input = new Beautiful.Input(); // input depends on Simulation

  Deps.autorun(function() {
    var range = self.world.perspective.grid.getRange();
    var map = self.world.perspective.getMap();
    var connection = Rift.connection();
    if (!map || !connection) return;

    connection.subscribe('map',
      range.xMin - 1,
      range.xMax + 1,
      range.yMin - 1,
      range.yMax + 1,
      map.name);
  });
}

};
