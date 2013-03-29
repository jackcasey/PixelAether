function isInt(n) {
   return typeof n === 'number' && n % 1 == 0;
}

function blockContextMenu(myElement) {
  myElement.addEventListener('contextmenu', function(event) {
  	event.preventDefault();
  });
}