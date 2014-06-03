/*------------------------------------------------------------
Aggregate interface, behavior surrounding connecting to
servers, choosing and viewing a map, etc
------------------------------------------------------------*/
Beautiful.World = function(){
  var windowSize = getWindowSize();
  this.view = new Beautiful.View(); // wraps our DOM canvas
  this.view.size.set(windowSize.width, windowSize.height);
  this.perspective = new Beautiful.Perspective(this.view); // Wraps chunkRenderers
}

/*------------------------------------------------------------
world.perspective stores the map.tileset accessible via
setters and getters. Is this the best place?

connect
drawFigure
go
------------------------------------------------------------*/
Beautiful.World.prototype = {

  connect: function(url){
    Rift.open(url);
  },

  drawFigure: function(figure, addr, size){
    this.view.drawFigure(
      figure,
      this.perspective.worldToSim(addr),
      size);
  },

  go: function(options){
    // see coords.md docs for details
  }

} // Beautiful.World.prototype

