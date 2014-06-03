/*------------------------------------------------------------
Rift keeps track of all the connections we have made with DDP
servers.

There is one current connection, and one or more non-current
------------------------------------------------------------*/
var _portalDep = new Deps.Dependency;

var _portal = new Portal;  // current portal
var _portals = {};
_portals[_portal.url] = _portal;

Rift = {};

// add, but don't set the main connection
Rift.add = function(url){
  url = stripUrl(url);
  if (_portals[url]) return;
  _portals[url] = new Portal(url);
};

// get collection by name
Rift.collection = function(name, url){
  _portalDep.depend();
  var portal = url ? _portals[stripUrl(url)] : _portal;
  return portal.getCollection(name);
};

// Return the current connection. (reactive)
// Or return an open connection via url
Rift.connection = function(url){
  if (url && _portals[url]) {
    url = stripUrl(url);
    return _portals[url].connection;
  }
  _portalDep.depend();
  return _portal.connection;
};

// open a rift
Rift.open = function(url){
  url = stripUrl(url);

  // are we already connecting/connected
  if (url === _portal.url) return;

  // if first time connecting
  if (!_portals[url]) Rift.add(url);

  _portal = _portals[url];
  _portalDep.changed();
};
