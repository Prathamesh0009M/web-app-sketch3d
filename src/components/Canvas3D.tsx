import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Rectangle, Square } from "../utils/shape";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const W = 600, H = 500, CAM = 5;

const scene = new THREE.Scene();
scene.background = new THREE.Color("white");
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(W, H);

// two cameras — swap on mode change
const cam2d = new THREE.OrthographicCamera(-CAM, CAM, CAM, -CAM, 0.1, 100);
cam2d.position.z = 10;

const cam3d = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
cam3d.position.set(4, 3, 6);
cam3d.lookAt(0, 0, 0);

const controls = new OrbitControls(cam3d, renderer.domElement);

controls.enableDamping = true;   // smooth motion
controls.enableZoom = true;
controls.enablePan = true;



scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dlight = new THREE.DirectionalLight(0xffffff, 1);
dlight.position.set(5, 8, 5);
scene.add(dlight);

let liveMesh: THREE.Object3D | null = null;

type Props = {
  vertices: number[];
  shape: Rectangle | Square | null;
  mode: "2d" | "3d";
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
};

export default function Canvas3D({ vertices, shape, mode, onMouseDown, onMouseMove, onMouseUp }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  controls.enabled = (mode === "3d");

  useEffect(() => {
    mountRef.current?.appendChild(renderer.domElement);
    return () => { mountRef.current?.removeChild(renderer.domElement); };
  }, []);


  useEffect(() => {
    if (liveMesh) { scene.remove(liveMesh); (liveMesh as any).geometry?.dispose(); liveMesh = null; }

    let rVertices: number[] | null = null;

    if (vertices && vertices.length > 0) {
      // STL file path
      rVertices = vertices;
    } else if (shape) {
      // Drawn shape path
      rVertices = mode === "3d" ? shape.getVertices3D(2) : shape.getVertices();
    }

    if (!rVertices || rVertices.length === 0) {
      renderer.render(scene, mode === "3d" ? cam3d : cam2d);
      return;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(rVertices), 3));

    if (mode === "3d" || (vertices && vertices.length > 0)) {
      geo.computeVertexNormals();
      geo.computeBoundingBox();

      const box = geo.boundingBox!;
      const center = new THREE.Vector3();
      box.getCenter(center);
      geo.translate(-center.x, -center.y, -center.z);

      const size = new THREE.Vector3();
      box.getSize(size);
      const scale = 2 / Math.max(size.x, size.y, size.z);
      geo.scale(scale, scale, scale);

      geo.rotateX(30);
      geo.rotateY(45);
      geo.rotateZ(30);
     
      liveMesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: 0x4a90d9, side: THREE.DoubleSide })
      );
    } else {
      liveMesh = new THREE.LineSegments(
        geo,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
    }


    scene.add(liveMesh);

    function animate() {
      requestAnimationFrame(animate);

      if (mode === "3d") {
        controls.update();
      }

      renderer.render(scene, mode === "3d" ? cam3d : cam2d);
    }

    animate();
  }, [vertices, shape, mode]);

  return (
    <div ref={mountRef}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
      style={{
        border: "2px solid black", display: "inline-block",
        cursor: mode === "3d" ? "default" : "crosshair"
      }} />
  );
}