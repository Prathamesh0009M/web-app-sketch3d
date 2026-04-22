import { DataClass } from "./Dataclass";
import { Rectangle, Square } from "./shape";

export function shapeToData(shape: Rectangle|Square, depth = 1) {
  const data = DataClass.instance!;
  data.vertices = [];
  data.triangles = [];

  const verts = shape.getVertices3D(depth); 

  for (let i = 0; i < verts.length; i += 9) {
    data.addTriangle(
      verts[i], verts[i+1], verts[i+2],
      verts[i+3], verts[i+4], verts[i+5],
      verts[i+6], verts[i+7], verts[i+8],
    );
  }
}