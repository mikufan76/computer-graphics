class cgIShape {
    constructor() {
        this.points = [];
        this.bary = [];
        this.indices = [];
    }

    addTriangle(x0, y0, z0, x1, y1, z1, x2, y2, z2) {
        var nverts = this.points.length / 4;

        // push first vertex
        this.points.push(x0);
        this.bary.push(1.0);
        this.points.push(y0);
        this.bary.push(0.0);
        this.points.push(z0);
        this.bary.push(0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;

        // push second vertex
        this.points.push(x1);
        this.bary.push(0.0);
        this.points.push(y1);
        this.bary.push(1.0);
        this.points.push(z1);
        this.bary.push(0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;

        // push third vertex
        this.points.push(x2);
        this.bary.push(0.0);
        this.points.push(y2);
        this.bary.push(0.0);
        this.points.push(z2);
        this.bary.push(1.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
    }
}

class Cube extends cgIShape {
    constructor(subdivisions) {
        super();
        this.makeCube(subdivisions);
    }

    makeCube(subdivisions) {
        // fill in your code here.
        // delete the code below first.
        console.log(subdivisions);
        subdiv = subdivisions;
        guys = {};
        dist = 1 / subdivisions;

        // One face

        for (let i = 0; i < subdivisions; i++) {
            for (let j = 0; j < subdivisions; j++) {
                let u = i / subdivisions;
                let v = j / subdivisions;

                const [x, y] = getQuadPoint(
                    u,
                    v,
                    [-0.5, -0.5],
                    [0.5, -0.5],
                    [-0.5, 0.5],
                    [0.5, 0.5]
                );
                w = x + dist;
                z = y + dist;

                let p1 = [x, y, -0.5];
                let p2 = [w, y, -0.5];
                let p3 = [w, z, -0.5];
                let p4 = [x, z, -0.5];
                addTriangle(...p1, ...p2, ...p3);
                addTriangle(...p1, ...p3, ...p4);

                p1 = [x, y, 0.5];
                p2 = [w, y, 0.5];
                p3 = [w, z, 0.5];
                p4 = [x, z, 0.5];
                addTriangle(...p3, ...p2, ...p1);
                addTriangle(...p4, ...p3, ...p1);

                p1 = [x, 0.5, y];
                p2 = [w, 0.5, y];
                p3 = [w, 0.5, z];
                p4 = [x, 0.5, z];
                addTriangle(...p1, ...p2, ...p3);
                addTriangle(...p1, ...p3, ...p4);

                p1 = [x, -0.5, y];
                p2 = [w, -0.5, y];
                p3 = [w, -0.5, z];
                p4 = [x, -0.5, z];
                addTriangle(...p3, ...p2, ...p1);
                addTriangle(...p4, ...p3, ...p1);

                p1 = [0.5, x, y];
                p2 = [0.5, w, y];
                p3 = [0.5, w, z];
                p4 = [0.5, x, z];
                addTriangle(...p3, ...p2, ...p1);
                addTriangle(...p4, ...p3, ...p1);

                p1 = [-0.5, x, y];
                p2 = [-0.5, w, y];
                p3 = [-0.5, w, z];
                p4 = [-0.5, x, z];
                addTriangle(...p1, ...p2, ...p3);
                addTriangle(...p1, ...p3, ...p4);
            }
        }
    }

    getQuadPoint(u, v, p1, p2, p3, p4) {
        x = 1 - u;
        q = [x * p1[0] + u * p2[0], x * p1[1] + u * p2[1]];
        r = [x * p3[0] + u * p4[0], x * p3[1] + u * p4[1]];

        x = 1 - v;
        q = [q[0] * x, q[1] * x];
        r = [r[0] * v, r[1] * v];
        return [q[0] + r[0], q[1] + r[1]];
    }
}

class Cylinder extends cgIShape {
    constructor(radialdivision, heightdivision) {
        super();
        this.makeCylinder(radialdivision, heightdivision);
    }

    makeCylinder(radialdivision, heightdivision) {
        r = 0.25;
        const step = 360 / radialdivision;
        const heightStep = 1 / heightdivision;
        console.log(heightdivision);
        // radians = deg * pi/180

        slices = [];
        for (let i = 0; i < 360; i += step) {
            rads = degToRad(i);
            x = getCirclePoint(r, rads, -0.5);
            slices.push(x);
        }

        // base
        for (let i = 0; i < slices.length; i++) {
            const [x1, z1] = slices[i];
            const next = (i + 1) % radialdivision;
            const [x2, z2] = slices[next];
            let y = 0.5;
            addTriangle(x1, y, z1, x2, y, z2, 0, y, 0);
            addTriangle(x2, -y, z2, x1, -y, z1, 0, -y, 0);

            for (let j = 0; j < heightdivision; j++) {
                height = 0.5 - j / heightdivision;
                let p1 = [x1, height, z1];
                let p2 = [x2, height, z2];
                let p3 = [x1, height - heightStep, z1];
                addTriangle(...p2, ...p1, ...p3);

                p1 = [x1, height - heightStep, z1];
                p2 = [x2, height - heightStep, z2];
                p3 = [x2, height, z2];
                addTriangle(...p1, ...p2, ...p3);
            }
        }
    }

    degToRad(num) {
        return (num * Math.PI) / 180;
    }

    getCirclePoint(r, theta, pos) {
        return [r * Math.cos(theta), r * Math.sin(theta)];
    }
}

class Cone extends cgIShape {
    constructor(radialdivision, heightdivision) {
        super();
        this.makeCone(radialdivision, heightdivision);
    }

    makeCone(radialdivision, heightdivision) {
        // Fill in your cone code here.
    }
}

class Sphere extends cgIShape {
    constructor(slices, stacks) {
        super();
        this.makeSphere(slices, stacks);
    }

    makeSphere(slices, stacks) {
        // fill in your sphere code here
    }
}

function radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}
