var treeClicker = function(worldPos) {
  var selector = {
    xCoord: worldPos.xCoord,
    yCoord: worldPos.yCoord,
    mapName: gGame.world.getMap().name
  };
  console.log('Click Map Selector:', selector);
  var chunk = Chunks.findOne(selector);
  var tileValue = null;
  if (!chunk) return;
  var tileIndex = (chunk.width * worldPos.y) + worldPos.x;
  if (Session.get('clicker') === 'tree') {
    tileValue = chunk.layerData.plant[tileIndex];
    tileValue = (tileValue === 1) ? 0 : 1; // if it's a tree, make it nothing. else, make it a tree
  }
  else if (Session.get('clicker') === 'water') {
    tileValue = chunk.layerData.ground[tileIndex];
    tileValue = (tileValue === 11) ? 10 : 11;
  }
  else if (Session.get('clicker') === 'path') {
    tileValue = chunk.layerData.ground[tileIndex];
    tileValue = (tileValue === 16) ? 10 : 16;
  }
  else if (Session.get('clicker') === 'lava') {
    tileValue = chunk.layerData.ground[tileIndex];
    tileValue = (tileValue === 14) ? 15 : 14;
  }
  else if (Session.get('clicker') === 'sand') {
    tileValue = chunk.layerData.ground[tileIndex];
    tileValue = (tileValue === 18) ? 10 : 18;
  }
  else return;

  Meteor.call('setTile', selector, worldPos.x, worldPos.y, tileValue, 
    (Session.get('clicker') === 'tree')? 'plant' : 'ground');
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
    var worldPos = gGame.world.simToWorld(input.mouse.simPos);
    treeClicker(worldPos);
  });

  input.on('MOUSE1', 'drag', function(){
    var delta = input.mouse.deltaPos;
    gGame.world.moveCamera({x: -delta.x, y: -delta.y});
  });

};
