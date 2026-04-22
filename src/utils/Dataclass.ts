export interface Vertex {
    x: number;
    y: number;
    z: number;
}

export interface Triangle {
    v1: number;
    v2: number;
    v3: number;
}

export class DataClass {
    private static readonly TOLERANCE = 1e-6;
    static instance = new DataClass();


    vertices: Vertex[] = [];
    triangles: Triangle[] = [];



    storeData(data: number[]) {
        this.vertices = [];
        this.triangles = [];

        for (let i = 0; i < data.length; i += 9) {
            const indices: number[] = [];
            for (let j = 0; j < 9; j += 3) {
                indices.push(this.findOrAddVertex(data[i + j], data[i + j + 1], data[i + j + 2]));
            }
            if (indices.length === 3) {
                this.triangles.push({ v1: indices[0], v2: indices[1], v3: indices[2] });
            }
        }
    }
    getData(): number[] {
        const data: number[] = [];
        for (const t of this.triangles) {
            for (const vi of [t.v1, t.v2, t.v3]) {
                const v = this.vertices[vi];
                data.push(v.x, v.y, v.z);
            }
        }
        return data;
    }
    
    addTriangle(
        x1: number, y1: number, z1: number,
        x2: number, y2: number, z2: number,
        x3: number, y3: number, z3: number
    ) {
        const i1 = this.findOrAddVertex(x1, y1, z1);
        const i2 = this.findOrAddVertex(x2, y2, z2);
        const i3 = this.findOrAddVertex(x3, y3, z3);

        this.triangles.push({ v1: i1, v2: i2, v3: i3 });
    }

    private withinTolerance(a: Vertex, x: number, y: number, z: number): boolean {
        return (
            Math.abs(a.x - x) < DataClass.TOLERANCE &&
            Math.abs(a.y - y) < DataClass.TOLERANCE &&
            Math.abs(a.z - z) < DataClass.TOLERANCE
        );
    }

    private findOrAddVertex(x: number, y: number, z: number): number {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.withinTolerance(this.vertices[i], x, y, z)) return i;
        }
        this.vertices.push({ x, y, z });
        return this.vertices.length - 1;
    }
}