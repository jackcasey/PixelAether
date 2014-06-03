/*------------------------------------------------------------
Wraps a server connection, and collections from that server
------------------------------------------------------------*/
Portal = function(url){
  if (url) url = stripUrl(url);
  this.collections = {};
  this.connection = url ? DDP.connect(url) : Meteor;
  this.url = url || stripUrl(Meteor.absoluteUrl());
}

Portal.prototype = {

  getCollection: function(name){
    if (this.url === stripUrl(Meteor.absoluteUrl()) && name === 'chunks')
      return Chunks;
    if (!this.collections[name])
      this.collections[name] = new Meteor.Collection(name, this.connection);
    return this.collections[name]
  }

}; // Portal.prototype
