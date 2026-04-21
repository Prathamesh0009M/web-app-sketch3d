import { useState } from "react";
import * as THREE from "three";
import Canvas3D from "./components/Canvas3D";
import { Rectangle, Square } from "./utils/shape";
import { openSTLFile } from "./utils/STL"
const W = 600, H = 500, CAM = 5;

function toScene(px: number, py: number) {
  return new THREE.Vector2(
    (px / W - 0.5) * 2 * CAM,
    -((py / H) - 0.5) * 2 * CAM,
  );
}

export default function App() {
  const [shape, setShape] = useState<Rectangle | Square | null>(null);
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const [drawing, setDrawing] = useState(false);

  const getPoint = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return toScene(e.clientX - r.left, e.clientY - r.top);
  };
  const [shapeName, setshapeName] = useState("rectangle")


  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "3d") return;
    const p = getPoint(e);
    if (shapeName === "rectangle") setShape(new Rectangle(p, p));
    if (shapeName === "square") setShape(new Square(p, p));

    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing || !shape) return;
    shape.setEnd(getPoint(e));
   if(shapeName === "square") setShape(new Square(shape.start, shape.end));
     else setShape(new Rectangle(shape.start, shape.end));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (drawing) shape?.setEnd(getPoint(e));
    setDrawing(false);
  };

  const handleExtrude = () => setMode("3d");

  const handleEdit = () => {
    setMode("2d");
    setVertices(new Float32Array(0)); 
  };
  const [vertices, setVertices] = useState<Float32Array>(new Float32Array(0));

  const handleOpenSTL = async () => {
    let v = await openSTLFile();
    setVertices(v);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>

        <p>select shape:</p>
        <select name="shape" id="shape" onChange={(e) => setshapeName(e.target.value)}>
          <option value="rectangle">Rectangle</option>
          <option value="square">Square</option>
        </select>


        <button onClick={handleExtrude} disabled={!shape || mode === "3d" || vertices.length > 0}>
          Extrude to 3D
        </button>
        <button onClick={handleEdit} disabled={mode === "2d"}>
          Edit
        </button>
        <button onClick={() => { setShape(null); setMode("2d"); setVertices(new Float32Array(0)); }}>
          Reset
        </button>
      </div>

      <Canvas3D
        vertices={vertices}
        shape={shape}
        mode={mode}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}

      />

      <button onClick={handleOpenSTL}>STL opener</button>
    </div>
  );
}