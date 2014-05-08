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
  mapName: 'main',              // method for designating maps

  // 3D coordinate of chunk within the map
  cx:  3,
  cy: -1,
  cz:  0, // Default = 0, not implemented

  // tx, ty are pixel position within chunk
  tx: 4,
  ty: 7,

  // px, py are a pixel position within the chunk
  // center of chunk is 0, 0
  px: 49,
  py: 55
}
```

Note: currently x,y are implemented inconsistently
For the camera, x, y are pixel position within chunk

For the worldToSim function, x, y are tile position within the chunk

how should we implement this?
