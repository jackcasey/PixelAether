/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.ImageLibrary = function(){
	this.images = {};
};

/*------------------------------------------------------------
load
------------------------------------------------------------*/

Beautiful.ImageLibrary.prototype = {

load: function(filename, onComplete) {
	var image = new Image;
	this.images[filename] = image;
	image.onload = onComplete;
	image.src = filename;
}

}; // prototype