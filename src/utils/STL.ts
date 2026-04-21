export function parseSTL(buffer: ArrayBuffer): Float32Array {
  const text = new TextDecoder().decode(buffer);
  return parseASCIISTL(text);
}

function parseASCIISTL(data: string): Float32Array {
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

  return new Float32Array(vertices);
}

export function openSTLFile(): Promise<Float32Array> {
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

      resolve(vertices);
    };

    input.click();
  });
}


// next step store the stl data into the traingle and data class use that for the open and close the files.. 