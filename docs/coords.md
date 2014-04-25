# Coordinate systems

## Canvas 

- upper left is 0,0
- y axis increases as we move down

## Simulation 

- Used to refer to a point in a Beautiful.View (a wrapper around an HTML5 canvas)
- The center of the viewport is 0,0
- y axis increases as we move up
- get mouse position with `input.mouse.simPosition`

## World

- A point on a map

```
{
  host: 'www.pixelaether.com',  // Not implemented
  mapName: 'main',
  xCoord:  3,                   // coordinate of chunk within the map
  yCoord: -1,
  zCoord:  0,                   // Not implemented
  x: 40,                        // pixel position within chunk 
  y: 70
}
```