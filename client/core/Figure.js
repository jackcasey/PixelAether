
/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.Figure = function(options) {
  this.jsImage = dummyImage;
  this.tileset = dummyTileset;
  this.index = -1;
  this.upperLeftX = 0;
  this.upperLeftY = 0;
  this.size = new Beautiful.Size2D;

  if (options.tileset) 
    this.setTileset(options.tileset);

  if (typeof options.index === 'number')
    this.setIndex(options.index);
};

var dummyImage = new Image;
var dummyTileset = {};

/*------------------------------------------------------------
_update
setIndex
setTileset
------------------------------------------------------------*/
Beautiful.Figure.prototype = {

_update: function(){
  if (this.tileset === dummyTileset) return;
  if (this.index === -1) return; // no index
  this.upperLeftX = this.tileset.getUpperLeftX(this.index);
  this.upperLeftY = this.tileset.getUpperLeftY(this.index);
  this.size.set(this.tileset.tileWidth, this.tileset.tileHeight);
},

setIndex: function(index){
  if (index === this.index) return; // no change
  if (this.jsImage === dummyImage) return; // no image
  this.index = index;
  this._update();
},

setTileset: function(tileset){
  if (!tileset) return;
  if (typeof tileset === "string")
    tileset = Tilesets.findOne({name: tileset});
  if (this.tileset === tileset) return; // no change
  this.tileset = tileset;
  this.jsImage = imageLibrary.get(tileset.imageName);
  this._update();
}

}; // Beautiful.Figure.prototype
