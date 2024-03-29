var treeClicker = function(worldPos) {
  var selector = {
    cx: worldPos.cx,
    cy: worldPos.cy,
    mapName: gGame.world.perspective.getMap().name
  };
  console.log('Click Map Selector:', selector);
  var chunk = Rift.collection('chunks').findOne(selector);
  var tileValue = null;
  if (!chunk) return;
  var tileIndex = (chunk.width * worldPos.ty) + worldPos.tx;
  if (Session.get('clicker') === 'tree') {
    tileValue = chunk.plants[tileIndex];
    tileValue = (tileValue === 1) ? 0 : 0;
  }
  else if (Session.get('clicker') === 'water') {
    tileValue = chunk.ground[tileIndex];
    tileValue = (tileValue === 11) ? 10 : 11;
  }
  else if (Session.get('clicker') === 'path') {
    tileValue = chunk.ground[tileIndex];
    tileValue = (tileValue === 16) ? 10 : 16;
  }
  else if (Session.get('clicker') === 'lava') {
    tileValue = chunk.ground[tileIndex];
    tileValue = (tileValue === 14) ? 15 : 14;
  }
  else if (Session.get('clicker') === 'sand') {
    tileValue = chunk.ground[tileIndex];
    tileValue = (tileValue === 18) ? 10 : 18;
  }
  else return;

  Rift.connection().call('setTile', selector, worldPos.tx, worldPos.ty, tileValue,
    (Session.get('clicker') === 'tree')? 'plants' : 'ground');
};

initKeyBindings = function() {
  var input = gGame.input;

  input.on('I', 'up', function(){
    console.log('I UP!');
  });
  input.on('space', 'tap', function(){
    console.log('Fire!');
  });
  input.on('up_arrow', 'up', function(){
    console.log('Up Arrow (key up)');
  });
  input.on('T', 'up', function(){
    Session.set('clicker', 'tree');
  });
  input.on('W', 'up', function(){
    Session.set('clicker', 'water');
  });
  input.on('P', 'up', function(){
    Session.set('clicker', 'path');
  });
  input.on('S', 'up', function(){
    Session.set('clicker', 'sand');
  });
  input.on('L', 'up', function(){
    Session.set('clicker', 'lava');
  });

  input.on('MOUSE1', 'tap', function(){
	  // simulation to world coords
    var worldPos = gGame.world.perspective.simToWorld(input.mouse.simPos);
    treeClicker(worldPos);
  });

  input.on('MOUSE1', 'drag', function(){
    var delta = input.mouse.deltaPos;
    gGame.world.perspective.moveCamera({x: -delta.x, y: -delta.y});
  });

};
