import * as THREE from "three";

export class Rectangle {
  start: THREE.Vector2;
  end: THREE.Vector2;

  constructor(start: THREE.Vector2, end: THREE.Vector2) {
    this.start = start.clone();
    this.end = end.clone();
  }

  setEnd(p: THREE.Vector2)
  {
    this.end = p.clone(); 
  }

  getSTLDATA(){
    
  }
  getVertices(): Float32Array {
    const { x: x1, y: y1 } = this.start;
    const { x: x2, y: y2 } = this.end;

    return new Float32Array([
      x1,y1,0,  x2,y1,0,   
      x2,y1,0,  x2,y2,0,   
      x2,y2,0,  x1,y2,0,   
      x1,y2,0,  x1,y1,0,  
    ]);
  }
    getVertices3D(depth: number = 1): Float32Array {
    const { x: x1, y: y1 } = this.start;
    const { x: x2, y: y2 } = this.end;

    const z1 = 0;
    const z2 = depth;

    return new Float32Array([
      x1,y1,z1,  x2,y1,z1,  x2,y2,z1,
      x1,y1,z1,  x2,y2,z1,  x1,y2,z1,

      x1,y1,z2,  x2,y2,z2,  x2,y1,z2,
      x1,y1,z2,  x1,y2,z2,  x2,y2,z2,

      x1,y1,z1,  x1,y2,z1,  x1,y2,z2,
      x1,y1,z1,  x1,y2,z2,  x1,y1,z2,

      x2,y1,z1,  x2,y2,z2,  x2,y2,z1,
      x2,y1,z1,  x2,y1,z2,  x2,y2,z2,

      x1,y2,z1,  x2,y2,z1,  x2,y2,z2,
      x1,y2,z1,  x2,y2,z2,  x1,y2,z2,

      x1,y1,z1,  x2,y1,z2,  x2,y1,z1,
      x1,y1,z1,  x1,y1,z2,  x2,y1,z2,
    ]);
  }

}


export class Square{
  start:THREE.Vector2;
  end: THREE.Vector2;
  
  constructor(start: THREE.Vector2, end: THREE.Vector2) {
    this.start = start.clone();
    this.end = end.clone();
  }

   setEnd(p: THREE.Vector2) {
    const dx = p.x - this.start.x;
    const dy = p.y - this.start.y;

    const size = Math.max(Math.abs(dx), Math.abs(dy));

    const signX = dx >= 0 ? 1 : -1;
    const signY = dy >= 0 ? 1 : -1;

    this.end = new THREE.Vector2(
      this.start.x + size * signX,
      this.start.y + size * signY
    );
  }

  getVertices(): Float32Array {
    const { x: x1, y: y1 } = this.start;
    const { x: x2, y: y2 } = this.end;

    return new Float32Array([
      x1,y1,0,  x2,y1,0,
      x2,y1,0,  x2,y2,0,
      x2,y2,0,  x1,y2,0,
      x1,y2,0,  x1,y1,0,
    ]);
  }

  getVertices3D(depth: number = 1): Float32Array {
    const { x: x1, y: y1 } = this.start;
    const { x: x2, y: y2 } = this.end;

    const z1 = 0;
    const z2 = depth;

    return new Float32Array([
      // front
      x1,y1,z1,  x2,y1,z1,  x2,y2,z1,
      x1,y1,z1,  x2,y2,z1,  x1,y2,z1,

      // back
      x1,y1,z2,  x2,y2,z2,  x2,y1,z2,
      x1,y1,z2,  x1,y2,z2,  x2,y2,z2,

      // sides (same pattern)
      x1,y1,z1,  x1,y2,z1,  x1,y2,z2,
      x1,y1,z1,  x1,y2,z2,  x1,y1,z2,

      x2,y1,z1,  x2,y2,z2,  x2,y2,z1,
      x2,y1,z1,  x2,y1,z2,  x2,y2,z2,

      x1,y2,z1,  x2,y2,z1,  x2,y2,z2,
      x1,y2,z1,  x2,y2,z2,  x1,y2,z2,

      x1,y1,z1,  x2,y1,z2,  x2,y1,z1,
      x1,y1,z1,  x1,y1,z2,  x2,y1,z2,
    ]);
  }
}