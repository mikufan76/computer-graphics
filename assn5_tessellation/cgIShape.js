//
// fill in code that creates the triangles for a cube with dimensions 1x1x1
// on each side (and the origin in the center of the cube). with an equal
// number of subdivisions along each cube face as given by the parameter
//subdivisions
//
function makeCube(subdivisions) {
    // fill in your code here.
    // delete the code below first.
    console.log(subdivisions);
    subdiv = subdivisions;
    guys = {};
    const dist = 1 / subdivisions

    // One face

    for (let i = 0; i < subdivisions; i++) {
        for (let j = 0; j < subdivisions; j++) {
            let u = i / subdivisions;
            let v = j / subdivisions;

            const [x, y] = getQuadPoint(u, v, [-.5, -.5], [.5, -.5], [-.5, .5], [.5, .5])
            w = x + dist;
            z = y + dist;

            let p1 = [x, y, -.5]
            let p2 = [w, y, -.5]
            let p3 = [w, z, -.5]
            let p4 = [x, z, -.5]
            addTriangle(...p1, ...p2, ...p3)
            addTriangle(...p1, ...p3, ...p4)

            p1 = [x, y, .5]
            p2 = [w, y, .5]
            p3 = [w, z, .5]
            p4 = [x, z, .5]
            addTriangle(...p3, ...p2, ...p1)
            addTriangle(...p4, ...p3, ...p1)

            p1 = [x, .5, y]
            p2 = [w, .5, y]
            p3 = [w, .5, z]
            p4 = [x, .5, z]
            addTriangle(...p1, ...p2, ...p3)
            addTriangle(...p1, ...p3, ...p4)

            p1 = [x, -.5, y]
            p2 = [w, -.5, y]
            p3 = [w, -.5, z]
            p4 = [x, -.5, z]
            addTriangle(...p3, ...p2, ...p1)
            addTriangle(...p4, ...p3, ...p1)

            p1 = [.5, x, y]
            p2 = [.5, w, y]
            p3 = [.5, w, z]
            p4 = [.5, x, z]
            addTriangle(...p3, ...p2, ...p1)
            addTriangle(...p4, ...p3, ...p1)

            p1 = [-.5, x, y]
            p2 = [-.5, w, y]
            p3 = [-.5, w, z]
            p4 = [-.5, x, z]
            addTriangle(...p1, ...p2, ...p3)
            addTriangle(...p1, ...p3, ...p4)
        }
    }
}

function getQuadPoint(u, v, p1, p2, p3, p4) {
    x = 1 - u;
    q = [(x * p1[0]) + (u * p2[0]), (x * p1[1]) + (u * p2[1])]
    r = [(x * p3[0]) + (u * p4[0]), (x * p3[1]) + (u * p4[1])]

    x = 1 - v;
    q = [q[0] * x, q[1] * x]
    r = [r[0] * v, r[1] * v]
    return [q[0] + r[0], q[1] + r[1]]
}

//
// fill in code that creates the triangles for a cylinder with diameter 1
// and height of 1 (centered at the origin) with the number of subdivisions
// around the base and top of the cylinder (given by radialdivision) and
// the number of subdivisions along the surface of the cylinder given by
//heightdivision.
//
function makeCylinder(radialdivision, heightdivision) {
    r = .25;
    const step = 360 / radialdivision;
    const heightStep = 1/heightdivision
    console.log(heightdivision)
    // radians = deg * pi/180

    slices = []
    for (let i = 0; i < 360; i += step) {
        rads = degToRad(i)
        x = getCirclePoint(r, rads, -.5)
        slices.push(x)
    }

    // base
    for (let i = 0; i < slices.length; i++) {
        const [x1, z1] = slices[i];
        const next = (i + 1) % radialdivision
        const [x2, z2] = slices[next];
        let y = .5;
        addTriangle(x1, y, z1, x2, y, z2, 0, y, 0);
        addTriangle(x2, -y, z2, x1, -y, z1, 0, -y, 0);

        for (let j = 0; j < heightdivision; j++) {
            height = .5 - j / heightdivision
            let p1 = [x1, height, z1];
            let p2 = [x2, height, z2];
            let p3 = [x1, height-heightStep, z1]
            addTriangle(...p2, ...p1, ...p3)

            p1 = [x1, height-heightStep, z1];
            p2 = [x2, height-heightStep, z2];
            p3 = [x2, height, z2]
            addTriangle(...p1, ...p2, ...p3)

        }
    }




}

function degToRad(num) {
    return num * Math.PI / 180;
}

function getCirclePoint(r, theta, pos) {
    return [r * Math.cos(theta), r * Math.sin(theta)]
}

//
// fill in code that creates the triangles for a cone with diameter 1
// and height of 1 (centered at the origin) with the number of
// subdivisions around the base of the cone (given by radialdivision)
// and the number of subdivisions along the surface of the cone
//given by heightdivision.
//
function makeCone(radialdivision, heightdivision) {
    // fill in your code here.
}

//
// fill in code that creates the triangles for a sphere with diameter 1
// (centered at the origin) with number of slides (longitude) given by
// slices and the number of stacks (lattitude) given by stacks.
// For this function, you will implement the tessellation method based
// on spherical coordinates as described in the video (as opposed to the
//recursive subdivision method).
//
function makeSphere(slices, stacks) {
    // fill in your code here.
    // Need to subdivide in two directions
    // Around the equator (latitude)
    // From pole to pole (longitude)
    //Parameterize along latitude & longitude
    // radius
    // theta (longitude)
    //phi (latitude)
    // Longitude lines (“slices”) controlled by first factor
    // Iterate on θ to create
    // Latitude lines (“stacks”) controlled by second factor
    // Iterate on Φ to create
    // x = rcosθsinΦ
    // y = rsinθsinΦ
    // z - rcosθ
}

////////////////////////////////////////////////////////////////////
//
//  Do not edit below this line
//
///////////////////////////////////////////////////////////////////

function radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function addTriangle(x0, y0, z0, x1, y1, z1, x2, y2, z2) {
    var nverts = points.length / 4;

    // push first vertex
    points.push(x0);
    bary.push(1.0);
    points.push(y0);
    bary.push(0.0);
    points.push(z0);
    bary.push(0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;

    // push second vertex
    points.push(x1);
    bary.push(0.0);
    points.push(y1);
    bary.push(1.0);
    points.push(z1);
    bary.push(0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;

    // push third vertex
    points.push(x2);
    bary.push(0.0);
    points.push(y2);
    bary.push(0.0);
    points.push(z2);
    bary.push(1.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
}
