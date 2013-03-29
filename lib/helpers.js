function isInt(n) {
   return typeof n === 'number' && n % 1 == 0;
}

function preventContextMenu(myElement) {
  myElement.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
}

// get the appropriate requestAnimationFrame function,
// store it in the window object
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();