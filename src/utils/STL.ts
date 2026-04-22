import { DataClass } from "./Dataclass";

export function parseSTL(buffer: ArrayBuffer): number[] {
  const text = new TextDecoder().decode(buffer);
  return parseASCIISTL(text);
}

function parseASCIISTL(data: string): number[] {
  const vertices: number[] = [];

  const lines = data.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // look for lines starting with "vertex"
    if (line.startsWith("vertex")) {
      const parts = line.split(" ");

      // parts = ["vertex", x, y, z]
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);

      vertices.push(x, y, z);
    }
  }

  return vertices;
}
function serializeSTL(data: number[]): string {
  let stl = "solid model\n";

  for (let i = 0; i < data.length; i += 9) {
    const v1 = [data[i], data[i + 1], data[i + 2]];
    const v2 = [data[i + 3], data[i + 4], data[i + 5]];
    const v3 = [data[i + 6], data[i + 7], data[i + 8]];

    stl += `  facet normal 0 0 0\n`;
    stl += `    outer loop\n`;
    stl += `      vertex ${v1[0]} ${v1[1]} ${v1[2]}\n`;
    stl += `      vertex ${v2[0]} ${v2[1]} ${v2[2]}\n`;
    stl += `      vertex ${v3[0]} ${v3[1]} ${v3[2]}\n`;
    stl += `    endloop\n`;
    stl += `  endfacet\n`;
  }

  stl += "endsolid model\n";
  return stl;
}

export function openSTLFile(): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".stl";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        reject("No file selected");
        return;
      }

      const buffer = await file.arrayBuffer();
      const vertices = parseSTL(buffer);
      DataClass.instance?.storeData(vertices);

      resolve(vertices);
    };

    input.click();
  });
}
export function saveSTLFile() {
  const data = DataClass.instance.getData();

  if (!data || data.length === 0) {
    console.warn("No STL data to save");
    return;
  }

  const stlText = serializeSTL(data);

  const blob = new Blob([stlText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "model.stl";
  a.click();

  URL.revokeObjectURL(url);
}


// next step store the stl data into the traingle and data class use that for the open and close the files.. 