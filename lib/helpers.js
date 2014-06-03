isInt = function(n) {
  return typeof n === 'number' && n % 1 === 0;
};

hypotenuse = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

preventContextMenu = function (myElement) {
  myElement.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
};

// Like Math.round, but round down on 0.5
roundPreferDown = function(number) {
  if (number - Math.floor(number) <= 0.5)
    return Math.floor(number);
  else
    return Math.ceil(number);
};

getRandomColor = function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
};

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
if (!Object.keys) {
  // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
  var hasDontEnumBug = true,
    dontEnums = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ],
    dontEnumsLength = dontEnums.length;

  for (var key in {"toString": null}) {
    hasDontEnumBug = false;
  }

  Object.keys = function keys(object) {

    if (
      (typeof object != "object" && typeof object != "function") ||
      object === null
    ) {
      throw new TypeError("Object.keys called on a non-object");
    }

    var keys = [];
    for (var name in object) {
      if (owns(object, name)) {
        keys.push(name);
      }
    }

    if (hasDontEnumBug) {
      for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
        var dontEnum = dontEnums[i];
        if (owns(object, dontEnum)) {
          keys.push(dontEnum);
        }
      }
    }
    return keys;
  };
}
