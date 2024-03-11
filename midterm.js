const colorPalette = {
    bgBrownTop: [119, 45, 18, 1],
    bgBrownBottom: [66, 32, 10, 1],
    lightYellow: [222, 192, 121],
    brightYellow: [252, 195, 56],
    grassGreen: [44, 131, 49],
    dudeBase: [237, 149, 35],
    ladyDress: [229, 153, 51],
    ladyFace: [253, 218, 167],
    ladyLipBottom: [222, 74, 71],
    ladyLipTop: [179, 22, 23],
    ladyHair: [142, 43, 12],
    ladyHand: [248, 235, 222],
    manFace: [224, 154, 35],
    manHand: [249, 215, 169],
    cape: [250, 230, 98],
    manHair: [24, 18, 15],

}
let firstLoop = false;
let clickedPoints = [];

function logger(message) {
    if (!firstLoop) console.log(message);
}

// You need to fill in the following functions.
function drawArtwork() {
    drawBackground();
    drawGrass();
    drawCape();
    const arm = [{ "x": 313, "y": 79 }, { "x": 216, "y": 181 }, { "x": 211, "y": 64 }, { "x": 238, "y": 207 }]
    drawNGon(arm, ...colorPalette.dudeBase);
    const ladyHand = [{ "x": 234, "y": 122 }, { "x": 241, "y": 123 }, { "x": 257, "y": 100 }, { "x": 270, "y": 87 }, { "x": 250, "y": 84 }, { "x": 240, "y": 110 }];
    const manHand = [{ "x": 252.1999969482422, "y": 111 }, { "x": 258.1999969482422, "y": 130 }, { "x": 271.1999969482422, "y": 113 }, { "x": 278.1999969482422, "y": 112 }, { "x": 299.1999969482422, "y": 103 }, { "x": 298.1999969482422, "y": 96 }, { "x": 264.1999969482422, "y": 91 }];
    drawNGon(manHand, ...colorPalette.manHand)
    drawNGon(ladyHand, ...colorPalette.ladyHand)
    const ladyThumb = [{ "x": 246, "y": 118 }, { "x": 266, "y": 100 }, { "x": 263, "y": 96 }, { "x": 256, "y": 105 }]
    drawNGon(ladyThumb, ...colorPalette.ladyHand)
    drawLady();
    const manHand2 = [{ "x": 311, "y": 96 }, { "x": 309, "y": 103 }, { "x": 321, "y": 136 }, { "x": 339, "y": 119 }, { "x": 331, "y": 101 }, { "x": 319, "y": 94 }];
    drawNGon(manHand2, ...colorPalette.manHand)
    drawDude();
    const ladyHand2 = [{ "x": 202.10000610351562, "y": 52 }, { "x": 212.10000610351562, "y": 56 }, { "x": 236.10000610351562, "y": 26 }, { "x": 253.10000610351562, "y": 10 }, { "x": 240.10000610351562, "y": 10 }, { "x": 223.10000610351562, "y": 16 }, { "x": 208.10000610351562, "y": 37 }];
    drawNGon(ladyHand2, ...colorPalette.ladyHand);

}

function drawCape() {
    const cape = [{ "x": 133, "y": 86 }, { "x": 136, "y": 26 }, { "x": 229, "y": 3 }, { "x": 333, "y": 31 }, { "x": 354, "y": 88 }, { "x": 340, "y": 138 }, { "x": 372, "y": 229 }, { "x": 387, "y": 372 }, { "x": 137, "y": 394 }]
    drawNGon(cape, ...colorPalette.cape)
}

function drawDude() {
    const neck = [{"x":190,"y":69},{"x":266,"y":77},{"x":237,"y":22},{"x":191,"y":25}];
    drawNGon(neck, ...colorPalette.manFace)

    const dudeOutfitPoints = [{ "x": 197, "y": 468 }, { "x": 126, "y": 285 }, { "x": 262, "y": 311 }, { "x": 175, "y": 33 }, { "x": 133, "y": 89 }, { "x": 236, "y": 205 }, { "x": 124, "y": 195 }, { "x": 149, "y": 441 }, { "x": 260, "y": 449 }, { "x": 210, "y": 63 }]
    drawNGon(dudeOutfitPoints, ...colorPalette.dudeBase)
    const arm = [{ "x": 227.0500030517578, "y": 160 }, { "x": 257.0500030517578, "y": 127 }, { "x": 250.0500030517578, "y": 104 }, { "x": 220.0500030517578, "y": 120 }];
    drawNGon(arm, ...colorPalette.dudeBase)

    // face
    const face = [{ "x": 173, "y": 34 }, { "x": 193, "y": 65 }, { "x": 222, "y": 64 }, { "x": 261, "y": 70 }, { "x": 238, "y": 34 }, { "x": 250, "y": 12 }, { "x": 208, "y": 18 }];
    drawNGon(face, ...colorPalette.manFace)
    const face2 = [{ "x": 258, "y": 69 }, { "x": 265, "y": 80 }, { "x": 291, "y": 68 }, { "x": 299, "y": 68 }, { "x": 303, "y": 58 }, { "x": 310, "y": 45 }, { "x": 279, "y": 63 }];[{ "x": 250, "y": 69 }, { "x": 267, "y": 77 }, { "x": 290, "y": 68 }, { "x": 299, "y": 69 }, { "x": 308, "y": 46 }, { "x": 284, "y": 57 }]
    drawNGon(face2, ...colorPalette.manFace);
    drawNGon([{ "x": 253, "y": 68 }, { "x": 266, "y": 82 }, { "x": 279, "y": 64 }], ...colorPalette.manFace)

    const hair = [{ "x": 250, "y": 14 }, { "x": 249, "y": 14 }, { "x": 236, "y": 36 }, { "x": 243, "y": 56 }, { "x": 261, "y": 68 }, { "x": 287, "y": 60 }, { "x": 308, "y": 45 }, { "x": 313, "y": 34 }, { "x": 299, "y": 13 }, { "x": 276, "y": 7 }];
    drawNGon(hair, ...colorPalette.manHair);

    // feet
    const legs = [{ "x": 307, "y": 404.6000061035156 }, { "x": 317, "y": 426.6000061035156 }, { "x": 417, "y": 380.6000061035156 }, { "x": 410, "y": 369.6000061035156 }];
    drawNGon(legs, ...colorPalette.manHand)
    const dogs = [{ "x": 414.3999938964844, "y": 373.6000061035156 }, { "x": 426.3999938964844, "y": 415.6000061035156 }, { "x": 413.3999938964844, "y": 430.6000061035156 }, { "x": 405.3999938964844, "y": 425.6000061035156 }, { "x": 406.3999938964844, "y": 409.6000061035156 }, { "x": 377.3999938964844, "y": 396.6000061035156 }];
    drawNGon(dogs, ...colorPalette.manHand)

}

function drawLady() {
    const dressCoords = [{ "x": 234, "y": 220 }, { "x": 256, "y": 131 }, { "x": 239, "y": 453 }, { "x": 300, "y": 442 }, { "x": 324, "y": 417 }, { "x": 322, "y": 393 }, { "x": 306, "y": 311 }, { "x": 307, "y": 209 }, { "x": 313, "y": 140 }]
    drawNGon(dressCoords, ...colorPalette.ladyDress)

    //hair
    const hair = [{ "x": 311, "y": 36 }, { "x": 289, "y": 61 }, { "x": 313, "y": 118 }, { "x": 340, "y": 113 }, { "x": 351, "y": 86 }, { "x": 346, "y": 64 }, { "x": 318, "y": 37 }];
    drawNGon(hair, ...colorPalette.ladyHair)

    const face = [{ "x": 272, "y": 87 }, { "x": 286, "y": 104 }, { "x": 317, "y": 97 }, { "x": 327, "y": 70 }, { "x": 320, "y": 63 }, { "x": 306, "y": 63 }];
    drawNGon(face, ...colorPalette.ladyFace);

    // eyes
    drawLine(307.06666564941406, 66, 305.06666564941406, 71, 0, 0, 0);
    drawLine(305.06666564941406, 71, 307.75, 75, 0, 0, 0);
    drawLine(306.5, 88, 304, 93, 0, 0, 0)
    drawLine(304, 93, 307.5, 97, 0, 0, 0)
    // nose
    //{"x":293.75,"y":77}
    // {"x":293.5,"y":83}

    const noseX = 293.75
    const holeLeng = 1;
    drawLine(noseX, 77, noseX, 77 + holeLeng, 0, 0, 0)
    drawLine(noseX, 83, noseX, 83 + holeLeng, 0, 0, 0)

    // mouth
    const mouth = [{ "x": 285.8000030517578, "y": 76 }, { "x": 285.8000030517578, "y": 86 }, { "x": 282.8000030517578, "y": 83 }, { "x": 282.8000030517578, "y": 79 }, { "x": 285.8000030517578, "y": 75 }, { "x": 286.51666259765625, "y": 75 }, { "x": 285.51666259765625, "y": 86 }, { "x": 281.51666259765625, "y": 81 }, { "x": 281.51666259765625, "y": 78 }]
    drawNGon(mouth, ...colorPalette.ladyLipBottom)
    const topLip = [{ "x": 285.8333282470703, "y": 75 }, { "x": 285.8333282470703, "y": 86 }, { "x": 287.8333282470703, "y": 82 }, { "x": 287.8333282470703, "y": 78 }]
    drawNGon(topLip, ...colorPalette.ladyLipTop)

    // arm
    const shoulder = [{ "x": 280.5, "y": 105 }, { "x": 255.5, "y": 131 }, { "x": 312.5, "y": 139 }, { "x": 313.5, "y": 109 }]
    drawNGon(shoulder, ...colorPalette.ladyHand);
    const arm1 = [{ "x": 256.56666564941406, "y": 166 }, { "x": 250.56666564941406, "y": 181 }, { "x": 251.56666564941406, "y": 211 }, { "x": 280.56666564941406, "y": 169 }];
    drawNGon(arm1, ...colorPalette.ladyHand)
    const arm2 = [{ "x": 242.26666259765625, "y": 121 }, { "x": 250.26666259765625, "y": 187 }, { "x": 252.26666259765625, "y": 210 }, { "x": 245.26666259765625, "y": 210 }, { "x": 230.26666259765625, "y": 151 }, { "x": 234.26666259765625, "y": 119 }];
    drawNGon(arm2, ...colorPalette.ladyHand)

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
    drawPaintSplatters(.5, 90, .65, ...colorPalette.lightYellow)
    drawPaintSplatters(.5, .1, .7, ...colorPalette.brightYellow)
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

function drawGrass() {
    const grassCoords = [{ "x": 1, "y": 418 }, { "x": 142, "y": 387 }, { "x": 380, "y": 367 }, { "x": 413, "y": 414 }, { "x": 427, "y": 484 }, { "x": 427, "y": 509 }, { "x": -1, "y": 510 }]
    drawNGon(grassCoords, ...colorPalette.grassGreen)
}


function drawWarhol() { }

function drawZoom() { }

function drawRect(x, y, width, height, r, g, b) {
    const p1 = { x: x, y: y };
    const p2 = { x: x, y: y + height };
    const p3 = { x: x + width, y: y + height }
    const p4 = { x: x + width, y: y }

    drawTriangle(p1, p2, p3, r, g, b);
    drawTriangle(p3, p4, p1, r, g, b)



}

function drawNGon(pts, r, g, b) {
    let yCoords = [
        ...pts.sort((a, b) => {
            let res = a.y - b.y;
            if (res === 0) {
                res = a.x - b.x;
            }
            return res;
        }),
    ];


    const startPoint = yCoords.shift();
    const points = [...yCoords]
    yCoords = [startPoint, ...yCoords.sort((a, b) => {
        const a1 = calcAngle(a.y - startPoint.y, a.x - startPoint.x);
        const a2 = calcAngle(b.y - startPoint.y, b.x - startPoint.x);
        return a1 > a2;
    })];

    // yCoords.forEach((pt, i) => {
    //     const math = 255 * (i / (yCoords.length - 1))
    //     logger(math)
    //     fill(math)
    //     circle(pt.x, pt.y, 10);
    // })

    // yCoords.forEach((pt, i) => {
    //     const a1 = calcAngle(pt.y - startPoint.y, pt.x - startPoint.x);
    //     logger(`point: ${JSON.stringify(pt)} angle = ${a1}`)
    // })

    // logger(yCoords);


    for (i = 1; i < yCoords.length - 1; i++) {
        const p1 = yCoords[i];
        const p2 = yCoords[i + 1];
        drawTriangle(startPoint, p1, p2, r, g, b)
    }




    // logger(`--------------------- `);
    // logger(`--------------- `);
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

    const startPoint = yCoords.shift();
    yCoords = [startPoint, ...(yCoords.slice(0, 3).sort((a, b) => {
        const a1 = calcAngle(a.y - startPoint.y, a.x - startPoint.x);
        const a2 = calcAngle(b.y - startPoint.y, b.x - startPoint.x);
        return a1 > a2;
    }))];



    logger(JSON.stringify(yCoords))
    const centroid = get_polygon_centroid(yCoords);

    let coords = yCoords.splice(0, 3);
    drawTriangle(...coords, r, g, b);
    const last = yCoords.shift();
    coords = coords.filter(pt => {
        let valid;
        if (last.x > centroid.x) {
            valid = !(pt.x < Math.abs(centroid.x) && pt.y < Math.abs(centroid.y));
        } else {
            valid = !(pt.x > Math.abs(centroid.x) && pt.y > Math.abs(centroid.y));
        }
        return valid;
    })
    coords.push(last);
    drawTriangle(...coords, r, g, b);


}

function get_polygon_centroid(pts) {
    var first = pts[0], last = pts[pts.length - 1];
    if (first.x != last.x || first.y != last.y) pts.push(first);
    var twicearea = 0,
        x = 0, y = 0,
        nPts = pts.length,
        p1, p2, f;
    for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i]; p2 = pts[j];
        f = p1.x * p2.y - p2.x * p1.y;
        twicearea += f;
        x += (p1.x + p2.x) * f;
        y += (p1.y + p2.y) * f;
    }
    f = twicearea * 3;
    return { x: x / f, y: y / f };
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
    // logger(`dy: ${ dy }\ndx: ${ dx }\nslope: ${ m }\nslope: ${ validSlope? "VALID": "INVALID" }`)

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
        // logger(`UPDATE COORDS\np0: ${ x0 }, ${ y0 }\np1: ${ x1 }, ${ y1 }`)
    }

    dy = Math.abs(y1 - y0);
    dx = x1 - x0;

    // east delta
    const dE = 2 * dy;
    // north east delta
    const dNe = 2 * (dy - dx);
    // decision param: east or north east
    let d = dE - dx; // 2*dy-dx

    // logger(`dE = ${ dE } = 2 * ${ y1 } - ${ y0 }`)
    // logger(`dNe = ${ dNe } = 2 * ((${ y1 } - ${ y0 }) - (${ x1 } -${ x0 }))`)
    // logger(`CALC END\ndx: ${ dx } \ndy: ${ dy } \nDE: ${ dE } \ndNE: ${ dNe } \nd: ${ d } `);

    let x = x0,
        y = y0;
    const yDir = y0 > y1 ? -1 : 1;

    // logger(`FINAl COORDS: \np0: ${ x0 }, ${ y0 } \np1: ${ x1 }, ${ y1 } `)

    for (x; x <= x1; x++) {
        // logger(`Plot: ${ x },${ y } `)
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
        return a1 > a2;
    }))];


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
                setPixelOpacity(x, y, r, g, b, 1)
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

    image(img, 0, 0, width, height);
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
    clickedPoints.push({ x: mouseX, y: mouseY })
    console.log(JSON.stringify(clickedPoints))
}