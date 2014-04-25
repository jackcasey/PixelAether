# Coordinate systems

## Canvas Coordinates

- upper left is 0,0
- y axis increases as we move down
- mostly only used by low level API

## Simulation Coordinates

- Used to refer to a point in a Beautiful.View (a wrapper around an HTML5 canvas)
- The center of the viewport is 0,0
- y axis increases as we move up
- get mouse position with `input.mouse.simPosition`

## World Coordinates

- An address in the pixel aether
- Some properties are optional
- the example below is an absolute address
  - most methods do not expect an absolute address

```
{
  url: 'www.pixelaether.com',   // Not implemented
  mapName: 'main',              // old method for designating maps
  map: 'mapMain',               // New method for designating maps

  // 3D coordinate of chunk within the map
  xCoord:  3,
  yCoord: -1,
  zCoord:  0, // Default = 0, not implemented

  // x, y are pixel position within chunk
  // 0, 0 is the center of the chunk
  // y axis increases as we move up
  // NOTE: these are NOT chunk tile coordinates
  x: 40,
  y: 70
}
```
