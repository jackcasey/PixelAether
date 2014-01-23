/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.ImageLibrary = function(){
  this.content = {};
};

/*------------------------------------------------------------
load
------------------------------------------------------------*/

Beautiful.ImageLibrary.prototype = {

add: function(name, filename) {
  if (this.content[name])
    throw 'Error: Image named "' + name + '"already exists.';
  var item = new Deps.Dependency;
  item.image = new Image;
  item.image.onload = function(){ item.changed(); };
  item.image.src = filename;
  this.content[name] = item;
},

get: function(name) {
  this.content[name].depend();
  return this.content[name].image;
}

}; // Beautiful.ImageLibraru.prototype
