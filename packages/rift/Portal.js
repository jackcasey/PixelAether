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
    // Careful: passing Meteor as 2nd arg to Collection breaks things
    var connection = (this.url === stripUrl(Meteor.absoluteUrl())) ?
      undefined : this.connection;
    if (!this.collections[name])
      this.collections[name] = new Meteor.Collection(name, connection);
    return this.collections[name]
  }

}; // Portal.prototype
