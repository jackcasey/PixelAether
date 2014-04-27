Beautiful.World = function(){
  var windowSize = getWindowSize();
  this.view = new Beautiful.View(); // wraps our DOM canvas
  this.view.size.set(windowSize.width, windowSize.height);
  this.perspective = new Beautiful.Perspective(this.view); // Wraps chunkRenderers
}

Beautiful.World.prototype = {

} // Beautiful.World.prototype
