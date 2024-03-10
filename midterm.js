const colorPalette = {
    bgBrownTop: [119, 45, 18, 1],
    bgBrownBottom: [66, 32, 10, 1],
    lightYellow: [222, 192, 121],
    brightYellow: [252, 195, 56],

}
let firstLoop = false;

function logger(message) {
    if (!firstLoop) console.log(message);
}

// You need to fill in the following functions.
function drawArtwork() {
    drawBackground();
    drawPaintSplatters(.5, 255, .65, ...colorPalette.lightYellow)
    drawPaintSplatters(.5, .1, .7, ...colorPalette.brightYellow)

    // setBround(.70);
    // setBround(.90);
}

function setPixelOpacity(x, y, r, g, b, a) {
    let calcOpacity = 10 * a;
    for (let i = 0; i < calcOpacity; i++) {
        setPixel(x, y, r, g, b);
    }
}

function drawBackground() {
    const top = color(...colorPalette.bgBrownTop);
    const bottom = color(...colorPalette.bgBrownBottom);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const interA = lerpColor(top, bottom, y / height);
            const r = interA._array[0] * interA.maxes["rgb"][0];
            const g = interA._array[1] * interA.maxes["rgb"][1];
            const b = interA._array[2] * interA.maxes["rgb"][2];
            setPixelOpacity(x, y, r, g, b, 1)
        }
    }
}

function drawPaintSplatters(max, noiseScale, a, r, g, b) {
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            // Scale input coordinates.
            let nx = noiseScale * x;
            let ny = noiseScale * y;

            // Compute noise value.
            const alpha = a * noise(nx, ny);
            if (alpha > max) {
                setPixelOpacity(x, y, r, g, b, alpha);
            }
        }
    }
}

function drawPeople() {
    drawRect(157, 18, 316 - 157, 410, 191, 123, 11)
}


function drawWarhol() { }

function drawZoom() { }

function setBround(scale) {
    const yellow = [222, 192, 121];

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            // Scale input coordinates.
            let nx = noiseScale * x;
            let ny = noiseScale * y;

            // Compute noise value.
            const alpha = noisey * noise(nx, ny);
            if (alpha > scale) {
                setPixel(x, y, 252, 195, 56);
                setPixel(x, y, 252, 195, 56);


            }
        }
    }


    for (let y = 0; y < height; y += 3) {
        for (let x = 0; x < width; x += 3) {
            // Scale input coordinates.
            let nx = noiseScale * x;
            let ny = noiseScale * y;

            // Compute noise value.
            // TODO
            // Convert to create rectangle/circle
            const alpha = noisey * noise(nx, ny);
            if (alpha > .8) {


            }
        }
    }

    // drawPoly(20, 20, 20, 200, 200, 20, 300, 200, 255, 0, 0)




    describe('A gray cloudy pattern.');
}

function drawRect(x, y, width, height, r, g, b) {
    drawPoly(x, y, x + width, y, x + width, y + height, x, y + height, r, g, b)
}

function drawPoly(x1, y1, x2, y2, x3, y3, x4, y4, r, g, b) {

    const points = [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 },
        { x: x4, y: y4 }
    ];
    let yCoords = [
        ...points.sort((a, b) => {
            let res = a.y - b.y;
            if (res === 0) {
                res = a.x - b.x;
            }
            return res;
        }),
    ];
    let coords = yCoords.splice(0, 3);
    logger(JSON.stringify(coords));
    drawTriangle(...coords, r, g, b);
    coords.shift();
    coords.push(yCoords.pop());
    drawTriangle(...coords, r, g, b);
    drawLine(coords[0].x, coords[0].y, coords[1].x, coords[1].y, r, g, b);

    logger(JSON.stringify(coords));

    logger(`---------------------`);
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
        if (!validSlope) {
            setPixel(y, x, r, g, b)
            setPixel(y, x, r, g, b)
        } else {
            setPixel(x, y, r, g, b);
            setPixel(x, y, r, g, b);
        }
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

// Check if point is to the right, left, or on the line
// Right if res > 0
// Edge if res == 0
// left if res < 0
// c is the point to check
function edge(ax, ay, bx, by, cx, cy) {
    return (cx - ax) * (by - ay) - (cy - ay) * (bx - ax);
}

function calcAngle(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
}

function drawTriangle(p1, p2, p3, r, g, b) {
    points = [p1, p2, p3];
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


    const orderedCoords = [p1, p2, p3] = [startPoint, ...(yCoords.slice(1, 3).sort((a, b) => {
        const a1 = calcAngle(a.y - startPoint.y, a.x - startPoint.x);
        const a2 = calcAngle(b.y - startPoint.y, b.x - startPoint.x);
        logger(`A1: ${a1} < A2: ${a2} = ${a1 > a2}`)
        return a1 > a2;
    }))];

    logger(orderedCoords);

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
                setPixel(x, y, r, g, b);
                setPixel(x, y, r, g, b);
                setPixel(x, y, r, g, b);
                setPixel(x, y, r, g, b);
                setPixel(x, y, r, g, b);
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

let img

function preload() {
    img = loadImage('./kith.jpg')
}

function setup() {
    createCanvas(500, 509);

    // image(img, 0, 0, width, height);
    noLoop();
}

function draw() {
    //background(220);

    if (whichDraw == 1) drawArtwork();
    if (whichDraw == 2) drawWarhol();
    if (whichDraw == 3) drawZoom();
    firstLoop = true;
}

function keyPressed() {
    if (key == '1') whichDraw = 1;
    if (key == '2') whichDraw = 2;
    if (key == '3') whichDraw = 3;

    redraw();
}

function mouseClicked() {
    console.log(`${mouseX}, ${mouseY}`)
}