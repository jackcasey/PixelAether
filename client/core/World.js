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

For ChunkRenderer to get the correct data+tileset we need:
  URL to the connected server
  The connection object returned by DDP.connect
    - will be passed to new Meteor.Collection as an option
    - we call connection.subscribe to subscribe
  Chunks collection from the connected server

connect
drawFigure
getChunks
getConnection
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

  getChunks: function(){
    Rift.connection(); // depend on current rift
    return Rift.collection('chunks');
  },

  getConnection: function(){
    return Rift.connection();
  },

  go: function(options){
    // see coords.md docs for details
  }

} // Beautiful.World.prototype

