//
// fill in code that creates the triangles for a cube with dimensions 1x1x1
// on each side (and the origin in the center of the cube). with an equal
// number of subdivisions along each cube face as given by the parameter
//subdivisions
//
function makeCube(subdivisions) {
    // fill in your code here.
    // delete the code below first.
    console.log(subdivisions)
    subdiv = subdivisions
    guys = {};
    div = .5 / subdivisions
    for (let i = 0; i < subdiv; i++) {
        for (let j = 0; j < subdiv; j++) {
            let x = i/subdiv
            let y = j/subdiv

            lt = [x-div,y-div, 0];
            rt = [div+x,y-div, 0];
            lb = [x-div, y+div, 0]
            rb = [x+div,y+div,.0]

            pos = `${i},${j}`
            guys[pos] = [lt,rt,rb,lb]


            addTriangle(...lt, ...rt, ...lb);
            addTriangle(...rt, ...rb,...lb)
        }
    }
    console.log(JSON.stringify(guys))
}

//
// fill in code that creates the triangles for a cylinder with diameter 1
// and height of 1 (centered at the origin) with the number of subdivisions
// around the base and top of the cylinder (given by radialdivision) and
// the number of subdivisions along the surface of the cylinder given by
//heightdivision.
//
function makeCylinder(radialdivision, heightdivision) {
    // fill in your code here.
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
