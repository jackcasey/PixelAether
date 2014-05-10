/*------------------------------------------------------------
Atomic Reactive Data Objects
------------------------------------------------------------*/

/*------------------------------------------------------------
------------------------------------------------------------*/
Beautiful.Size2D = function(width, height, canvas) {
  this._dep = new Deps.Dependency;
  this._canvas = canvas || {width:0, height: 0};
  this._size = {
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0
  };
  this.set(
    width  || this._size.width  || 2,
    height || this._size.height || 2);
}

Beautiful.Size2D.prototype = {

get: function() {
  this._dep.depend();
  return this._size;
},

getCenter: function() {
  this._dep.depend();
  return {x:this._size.centerX, y:this._size.centerY};
},

set: function(width, height) {
  if (width !== this._size.width || height !== this._size.height) {
    if (typeof width === 'number') {
      this._size.width = width;
      this._canvas.width = width;
      this._size.centerX = width * 0.5;
    }
    if (typeof height === 'number') {
      this._size.height = height;
      this._canvas.height = height;
      this._size.centerY = height * 0.5;
    }
    this._dep.changed();
  }
},

}; // Beautiful.Size2D.prototype


/*------------------------------------------------------------
Avoid using with objects that pass by reference - modifying 
the value returned by get will modify the _datum property 
without calling changed()

Consider throwing an error when we call set with a mutable 
datum.
------------------------------------------------------------*/
Beautiful.Datum = function(datum) {
  this._dep = new Deps.Dependency;
  this.set(datum);
}

Beautiful.Datum.prototype = {

dec:function() {
  if (typeof this._datum === 'number') {
    this._datum--;
    this._dep.changed();
    return this._datum;
  }
},

get:function() {
  this._dep.depend();
  return this._datum;
},

inc:function() {
  if (typeof this._datum === 'number') {
    this._datum++;
    this._dep.changed();
    return this._datum;
  }
},

set:function(datum) {
  if (datum !== this._datum) {
    this._datum = datum;
    this._dep.changed();
  }
},

}; // Beautiful.Datum.prototype
