PixelAether
===========

PixelAether is a 2D JavaScript Game Engine built on the Meteor framework.

Imagine a 2D minecraft creative mode sever with clients running in the browser.

PixelAether initializes a collaborative game world that:
- Runs in the your browser
- Is massivley multiplayer
- A PixelAether instance stores map data in a MongoDB
  - Maps of infinite size!
  - Infinite number of maps!

Example
-------

www.pixelaether.com

Local Setup
-----------
Install Meteor if you haven't already. (Meteor is the only dependency -- Pure JavaScript!)

    $ curl https://install.meteor.com | /bin/sh
    
Clone, Run

    $ git clone https://github.com/CharlesHolbrow/PixelAether.git
    $ cd PixelAether
    $ meteor
    
Navigate Browser to http://localhost:3000/

How?
----

PixelAether uses Meteor's Reactive Data pradigm to create and render tile-based 
game maps using the html5 Canvas element.

Users can edit the maps collaboratively in realtime. Only the sections of the map 
that you are viewing are synced with the server.

Maps are divided into 'Chunks'. By default a chunk is a 16 x 16 grid of map tiles 
sorted into two layers. A map may comtain any number of chunks. Each chunk is 
stored in a mongodb document.

Each chunk is rendered in an off-DOM canvas -- and updated in realtime as users
modify the map. Chunks are rendered adjacent each other on a DOM canvas 
-- a window into the Pixel Aether
