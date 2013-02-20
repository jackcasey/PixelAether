MapChunk = function(x, y, map) {
	this.x = x;
	this.y = y;
	this.map = map;
	this.tiles = new Array(MapChunk.size);
	for (var i; i < MapChunk.size; i++){
		this.tiles[i] = 0;
	};
}; 

MapChunk.width = 16;
MapChunk.height = 16;
MapChunk.size = MapChunk.width * MapChunk.height;

MapChunk.randomize = function(chunk) {
	var index = null;
	for (var i=0; i<MapChunk.size; i++){
		// index of validIndexes array
		index = Math.floor( (Math.random()*MapChunk.validIndexes.length) );
		chunk.tiles[i] = MapChunk.validIndexes;
	}
}

MapChunk.fill = function (chunk, tileIndex) {
	for (var i=0; i<MapChunk.size; i++) chunk.tiles[i] = tileIndex;
}

MapChunk.set = function (chunk, x, y, i) {
	// don't allow us to set out of bounds
	if (x >= this.width || y >= this.height ) return;
	// sanity check i
	if (typeof i !== 'number') return;

	chunk.tiles[y * chunk.width + x] = Math.floor(i);
}
