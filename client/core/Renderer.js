Beautiful.Renderer = function (canvas, width, height) {
  self = this;
  this.canvas = canvas;
  self.context = canvas.getContext('2d');
  self.canvas.height = height || 600;
  self.canvas.width = width || 500;
  // the most recent mouse position
  self.mouse = {
    x: 0, 
    y: 0
  };

  // wrap to bind functions to this object
  window.addEventListener('mousedown', function(event) {self.mousedown(event)});
  window.addEventListener('mouseup', function(event) {self.mouseup(event)});
  window.addEventListener('mousemove', function(event) {self.mousemove(event)});
}

Beautiful.Renderer.prototype.mousedown = function(event) {
  console.log(this);
};

Beautiful.Renderer.prototype.mouseup  = function(event) {

};

Beautiful.Renderer.prototype.mousemove = function(event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this.canvas;

  while (currentElement != null) {
    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;
    currentElement = currentElement.offsetParent;
  }

  this.mouse.x = event.pageX - totalOffsetX;
  this.mouse.y = event.pageY - totalOffsetY;

  console.log('status:')
  console.log(this.mouse);
  console.log(event.offsetX, event.offsetY);
};
