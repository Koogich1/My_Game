interface Position {
  x: number;
  y: number;
  velocityY: number;
}

interface Positions {
  [key: number]: Position;
}