/*------------------------------------------------------------
Wraps a server connection, and collections from that server
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


/*------------------------------------------------------------
Linker instances keeps track of all the connections we have
made with DDP servers.

There is one current connection, and one or more 
------------------------------------------------------------*/
var _portalDep = new Deps.Dependency;

var _portal = new Portal;  // current portal
var _portals = {};
_portals[_portal.url] = _portal;

Rift = {};

// open a rift
Rift.open = function(url){
  if (url === _portal.url)
    // already connecting/connected
    return;

  if (_portals[url]){
    // we have previously connected to this server
    _portal = _portals[url];
  }

  else {
    // first time connecting
    _portal = new Portal(url);
    _portals[url] = this._portal;
    _portal.getCollection('chunks');
  }

  _portalDep.changed();
};

// Return the current connection. Reactive.
Rift.connection = function(){
  _portalDep.depend();
  return _portal.connection;
};

Rift.collection = function(name, url){
  var portal = url ? _portals[url] : _portal;
  return portal.getCollection(name);
}
