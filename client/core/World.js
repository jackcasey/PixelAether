/*------------------------------------------------------------
Aggregate interface, behavior surrounding connecting to
servers, choosing a map, etc
------------------------------------------------------------*/
Beautiful.World = function(){
  var windowSize = getWindowSize();
  this.view = new Beautiful.View(); // wraps our DOM canvas
  this.view.size.set(windowSize.width, windowSize.height);
  this.perspective = new Beautiful.Perspective(this.view); // Wraps chunkRenderers

  this._portal = new Portal();  // current portal
  this._portals = {};           // all portals 
  this._portals[this._portal.url] = this._portal;

  // Connection, server, chunks
  this._portalDep = new Deps.Dependency;
}

/*------------------------------------------------------------
world.perspective currently stores the map.tileset accessible via
setters and getters. Is this the best place?

For ChunkRenderer to get the correct data+tileset we need:
  URL to the connected server
  The connection object returned by DDP.connect
    - will be passed to new Meteor.Collection as an option
    - we call connection.subscribe to subscribe
  Chunks collection from the connected server

connect
getChunks
getConnection
getUrl
go
------------------------------------------------------------*/
Beautiful.World.prototype = {

  connect: function(url){
    if (url === this._portal.url)
      // already connecting/connected
      return;

    if (this._portals[url]){
      // we have previously connected to this server
      this._portal = this._portals[url];
    }

    else {
      // first time connecting
      this._portal = new Portal(url);
      this._portals[url] = this._portal;
      this._portal.getCollection('chunks');
    }

    this._portalDep.changed();
  },

  getChunks: function(){
    this._portalDep.depend();
    return this._portal.getCollection('chunks');
  },

  getConnection: function(){
    this._portalDep.depend();
    return this._portal.connection;
  },

  getUrl: function(){
    this._portalDep.depend();
    return this._portal.url;
  },

  go: function(options){
    // see coords.md docs for details
  }

} // Beautiful.World.prototype


/*------------------------------------------------------------
------------------------------------------------------------*/
var Portal = function(url){
  this.collections = {};
  this.connection = url ? DDP.connect(url) : Meteor;
  this.url = url || Meteor.absoluteUrl();
}

Portal.prototype = {

  getCollection: function(name){
    if (this.url === Meteor.absoluteUrl() && name === 'chunks')
      return Chunks;
    if (!this.collections[name])
      this.collections[name] = new Meteor.Collection(name, this.connection);
    return this.collections[name]
  }

}; // Portal.prototype
