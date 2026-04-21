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