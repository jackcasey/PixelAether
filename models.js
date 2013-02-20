Chunks = new Meteor.Collection("chunks");

console.log('models.js: ', 'loaded Chunks')
if (Meteor.isServer) {
	Meteor.startup(function() {
		if (Chunks.find().count() === 0) {
			var a = new Array(256);
			for (var i = 0; i < a.length; i++) { a[i] = 0};
			Chunks.insert({
				x:0,
				y:0,
				map:null, 
				tiles:a
			});
		}; // if there are no documents
	}); // startup function
};

Meteor.methods({
	getChunk: function(x, y, map){

	}
});

//console.log('models.js tiles length:', Chunks.findOne().tiles.length);