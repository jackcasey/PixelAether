isInt = function(n) {
   return typeof n === 'number' && n % 1 == 0;
}

preventContextMenu = function (myElement) {
  myElement.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
}

