PixelAether
===========

Pixel Aether is a 2D collaborative game world.

Think of a 2D minecraft in creative mode -- all running in your browser.

www.pixelaether.com for an example.

How?
====

PixelAether uses Meteor's Reactive Data pradigm to create and render tile-based 
game maps using the html5 Canvas element. 

Users can edit the maps collaboratively in realtime. 

Maps are divided into 'Chunks'. By default a chunk is a 16 x 16 grid of map tiles 
sorted into two layers. A map may comtain any number of chunks. Each chunk is 
stored in a mongodb document.

Each chunk is rendered in an off-DOM canvas -- and updated in realtime as users
modify the map. Chunks are rendered adjacent each other on a DOM canvas 
-- a window into the Pixel Aether
