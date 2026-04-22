import { useState } from "react";
import * as THREE from "three";
import Canvas3D from "./components/Canvas3D";
import { Rectangle, Square } from "./utils/shape";
import { openSTLFile } from "./utils/STL";
import { DataClass } from "./utils/Dataclass";
import { shapeToData } from "./utils/service";
import { saveSTLFile } from "./utils/STL";
import "./App.css";

const W = 720, H = 540, CAM = 5;

function toScene(px: number, py: number) {
  return new THREE.Vector2(
    (px / W - 0.5) * 2 * CAM,
    -((py / H) - 0.5) * 2 * CAM
  );
}

export default function App() {
  const [shape, setShape] = useState<Rectangle | Square | null>(null);
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const [drawing, setDrawing] = useState(false);
  const [shapeName, setShapeName] = useState("rectangle");
  const [vertices, setVertices] = useState<number[]>([]);

  const getPoint = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return toScene(e.clientX - r.left, e.clientY - r.top);
  };

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
    if (shapeName === "square") setShape(new Square(shape.start, shape.end));
    else setShape(new Rectangle(shape.start, shape.end));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (drawing) shape?.setEnd(getPoint(e));
    setDrawing(false);
  };

  const handleOpenSTL = async () => {
    await openSTLFile();
    setMode("3d");
    setVertices(DataClass.instance?.getData() || []);
  };

  const handleSave = () => {
    if (!shape) return;
    shapeToData(shape, 2);
    saveSTLFile();
  };

  const hasContent = shape !== null || vertices.length > 0;

  return (
    <div className="app">
      <div className="app-header">
        <h1>Shape Studio</h1>
        <p>Draw · Extrude · Export STL</p>
      </div>

      <div className="toolbar">
        <span className="toolbar-label">Shape</span>
        <select value={shapeName} onChange={(e) => setShapeName(e.target.value)} disabled={mode === "3d"}>
          <option value="rectangle">Rectangle</option>
          <option value="square">Square</option>
        </select>

        <div className="toolbar-divider" />

        <button className="btn btn-primary" onClick={() => setMode("3d")} disabled={!shape || mode === "3d" || vertices.length > 0}>
          Extrude 3D
        </button>
        <button className="btn" onClick={() => setMode("2d")} disabled={mode === "2d"}>
          Edit 2D
        </button>

        <div className="toolbar-divider" />

        <button className="btn" onClick={handleSave} disabled={!shape}>Save STL</button>
        <button className="btn" onClick={handleOpenSTL}>Open STL</button>

        <div className="toolbar-divider" />

        <button
          className="btn btn-danger"
          onClick={() => { setShape(null); setMode("2d"); setVertices([]); }}
          disabled={!hasContent}
        >
          Reset
        </button>

        <span className={`mode-badge ${hasContent ? "active" : ""}`}>
          {mode.toUpperCase()}
        </span>
      </div>

      <div className="canvas-wrap">
        <Canvas3D
          vertices={vertices}
          shape={shape}
          mode={mode}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      <p className="hint">
        {mode === "2d" ? "Click and drag to draw a shape" : "Drag to orbit · Scroll to zoom"}
      </p>
    </div>
  );
}