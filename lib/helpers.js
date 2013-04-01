function isInt(n) {
   return typeof n === 'number' && n % 1 == 0;
}

function preventContextMenu(myElement) {
  myElement.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
}

