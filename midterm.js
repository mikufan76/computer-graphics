// You need to fill in the following functions.
function drawArtwork() {}

function drawBackground() {}

function randomGradient(ix, iy) {
    // No precomputed gradients mean this works for any number of grid coordinates
    const w = 8 * sizeof(unsigned);
    const s = w / 2; // rotation width
    let a, b;
    (a = ix), (b = iy);
    a *= 3284157443;
    b ^= (a << s) | (a >> (w - s));
    b *= 1911520717;
    a ^= (b << s) | (b >> (w - s));
    a *= 2048419325;
    let random = a * (3.14159265 / ~(~0 >> 1)); // in [0, 2*Pi]
    let v = { x: null, y: null };
    v.x = Math.cos(random);
    v.y = Math.sin(random);
    return v;
}

// Computes the dot product of the distance and gradient vectors.
function dotGridGradient(ix, iy, x, y) {
    // Get gradient from integer coordinates
    gradient = randomGradient(ix, iy);

    // Compute the distance vector
    dx = x - ix;
    dy = y - iy;

    // Compute the dot-product
    return dx * gradient.x + dy * gradient.y;
}

// Algo from wiki
function interpolate(a0, a1, w) {
    /* // You may want clamping by inserting:
     * if (0.0 > w) return a0;
     * if (1.0 < w) return a1;
     */
    return (a1 - a0) * w + a0;
    /* // Use this cubic interpolation [[Smoothstep]] instead, for a smooth appearance:
     * return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
     *
     * // Use [[Smootherstep]] for an even smoother result with a second derivative equal to zero on boundaries:
     * return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
     */
}

// Computes the dot product of the distance and gradient vectors.
function dotGridGradient(ix, iy, x, y) {
    // Get gradient from integer coordinates
    gradient = randomGradient(ix, iy);

    // Compute the distance vector
    dx = x - ix;
    dy = y - iy;

    // Compute the dot-product
    return dx * gradient.x + dy * gradient.y;
}

// Compute Perlin noise at coordinates x, y
function perlin(x, y) {
    // Determine grid cell coordinates
    x0 = Math.floor(x);
    x1 = x0 + 1;
    y0 = Math.floor(y);
    y1 = y0 + 1;

    // Determine interpolation weights
    // Could also use higher order polynomial/s-curve here
    sx = x - x0;
    sy = y - y0;

    // Interpolate between grid point gradients
    let n0, n1, ix0, ix1, value;

    n0 = dotGridGradient(x0, y0, x, y);
    n1 = dotGridGradient(x1, y0, x, y);
    ix0 = interpolate(n0, n1, sx);

    n0 = dotGridGradient(x0, y1, x, y);
    n1 = dotGridGradient(x1, y1, x, y);
    ix1 = interpolate(n0, n1, sx);

    value = interpolate(ix0, ix1, sy);
    return value; // Will return in range -1 to 1. To make it in range 0 to 1, multiply by 0.5 and add 0.5
}

function drawWarhol() {}

function drawZoom() {}

function drawLine(x1, y1, x2, y2, r, g, b) {
    let x0 = x1,
        y0 = y1;
    (x1 = x2), (y1 = y2);

    // make sure slope is between 0 and 1
    let dy = y1 - y0;
    let dx = x1 - x0;
    const m = dy / dx;
    const validSlope = Math.abs(dy) <= Math.abs(dx);
    // logger(`dy: ${dy}\ndx: ${dx}\nslope:${m}\nslope: ${validSlope ? "VALID" : "INVALID"}`)

    // slope is not! swap coordinates
    if (!validSlope) {
        let temp = x0;
        x0 = y0;
        y0 = temp;

        temp = x1;
        x1 = y1;
        y1 = temp;
    }

    // Algo must go from left to right
    if (x0 > x1) {
        // swap!
        // logger(`Not l to r!`)
        let temp = x0;
        x0 = x1;
        x1 = temp;

        temp = y0;
        y0 = y1;
        y1 = temp;
        // logger(`UPDATE COORDS\np0: ${x0}, ${y0}\np1: ${x1}, ${y1}`)
    }

    dy = Math.abs(y1 - y0);
    dx = x1 - x0;

    // east delta
    const dE = 2 * dy;
    // north east delta
    const dNe = 2 * (dy - dx);
    // decision param: east or north east
    let d = dE - dx; // 2*dy-dx

    // logger(`dE = ${dE} = 2 * ${y1} - ${y0}`)
    // logger(`dNe =${dNe} = 2 * ((${y1} - ${y0})- (${x1}-${x0}))`)
    // logger(`CALC END\ndx: ${dx}\ndy: ${dy}\nDE: ${dE}\ndNE: ${dNe}\nd: ${d}`);

    let x = x0,
        y = y0;
    const yDir = y0 > y1 ? -1 : 1;

    // logger(`FINAl COORDS: \np0: ${x0}, ${y0}\np1: ${x1}, ${y1}`)

    for (x; x <= x1; x++) {
        // logger(`Plot: ${x},${y}`)
        !validSlope ? setPixel(y, x, r, g, b) : setPixel(x, y, r, g, b);
        // update decision param
        if (d <= 0) {
            // Choose e
            d += dE;
        } else {
            // choose NE
            y += yDir;
            d += dNe;
        }
    }
}

function drawTriangle(p1x, p1y, p2x, p2y, p3x, p3y, r, g, b) {
    const points = [
        { x: p1x, y: p1y },
        { x: p2x, y: p2y },
        { x: p3x, y: p3y },
    ];

    const xCoords = [
        ...points.sort((a, b) => {
            return a.x - b.x;
        }),
    ];
    const yCoords = [
        ...points.sort((a, b) => {
            let res = a.y - b.y;
            if (res === 0) {
                res = a.x - b.x;
            }
            return res;
        }),
    ];

    // Order points in counter-clockwise order
    // start with smallest y coordinate
    let startPoint = yCoords[0];
    const egg = ([p1, p2, p3] = [
        startPoint,
        ...xCoords.filter((point) => point !== startPoint),
    ]);
    fill(255, 0, 0);
    circle(p1.x, p1.y, 5);
    fill(0, 255, 0);
    circle(p2.x, p2.y, 5);
    fill(0, 0, 255);
    circle(p3.x, p3.y, 5);

    let m = p3.y - p2.y / p3.x - p2.x;
    logger(m);

    if (
        m > 0 &&
        p1.x > p2.x &&
        p1.x > p3.x &&
        p1.y < p2.y &&
        p1.y < p3.y &&
        p3.y < p2.y &&
        p3.x > p2.x
    ) {
        let temp = p2;
        p2 = p3;
        p3 = temp;
    }

    const xMin = xCoords[0].x,
        xMax = xCoords[2].x;
    const yMin = yCoords[0].y,
        yMax = yCoords[2].y;

    for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
            const w0 = edge(p1.x, p1.y, p2.x, p2.y, x, y);
            const w1 = edge(p2.x, p2.y, p3.x, p3.y, x, y);
            const w2 = edge(p3.x, p3.y, p1.x, p1.y, x, y);

            if (w1 > 0 && w0 > 0 && w2 > 0) {
                setPixel(x, y, r, g, b);
            }
        }
    }
}

// Do not edit code below this line
// ------------------------------
//

let whichDraw = 1;

function setPixel(x, y, r, g, b) {
    stroke(r, g, b);
    point(x, y);
}

function setup() {
    createCanvas(500, 500);
    noLoop();
}

function draw() {
    background(220);

    if (whichDraw == 1) drawArtwork();
    if (whichDraw == 2) drawWarhol();
    if (whichDraw == 3) drawZoom();
}

function keyPressed() {
    if (key == '1') whichDraw = 1;
    if (key == '2') whichDraw = 2;
    if (key == '3') whichDraw = 3;

    redraw();
}
