/*------------------------------------------------------------
Reactive Data, stores a chunk's location, id
------------------------------------------------------------*/
Beautiful.ChunkAddress = function() {
	this.dep = new Deps.Dependency;
  this._private = this.NULL_ADDRESS;
};

/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.ChunkAddress.prototype = {
  get: function() {
    this.dep.depend();
    return this._private;
  },

  set: function(selector) {
    this._private = selector;
    this.dep.changed();
  },

  NULL_ADDRESS: {
    xCoord: null,
    yCoord: null,
    mapName: null, 
    _id: null
  }

};