// You need to fill in the following functions.
function drawArtwork() {
    const brown = [119, 45, 18];
    background(...brown);
    setBround(.70);
    setBround(.90);
}

function drawBackground() {}

function drawWarhol() {}

function drawZoom() {}

function setBround(scale) {
    const yellow = [241, 222, 112];
    let noiseScale = 0.4;
    let noisey = 1;
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            // Scale input coordinates.
            let nx = noiseScale * x;
            let ny = noiseScale * y;

            // Compute noise value.
            const alpha = noisey * noise(nx, ny);
            if (alpha > scale) {
                setPixel(x, y, yellow[0], yellow[1], yellow[2]);
            }
        }
    }

    describe('A gray cloudy pattern.');
}

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
