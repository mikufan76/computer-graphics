// Functions you need to write
function clipPoly(vertices, left, bottom, right, top) {
    let newVertices = []

    if (vertices.length % 2 == 0) {
        for (let i = 0; i < vertices.length; i += 2) {
            x = vertices[i]
            y = vertices[i + 1]

            if (!inside(x, y, left, bottom, right, top)) {
                newVertices.push(...output(x, y, left, bottom, right, top))
            } else {
                newVertices.push(x, y)
            }
        }
    }
    return newVertices
}

function inside(x, y, left, bottom, right, top) {
    if (x > right || y > top || x < left || y < bottom) {
        return false
    }
    return true
}

function intersects(x, y, left, bottom, right, top) {
    if (x > right) {

    }
    else if (x < left) {
    }

    if (y > top) {
    } else if (y < bottom) {
    }
}

function output(x, y, left, bottom, right, top) {
    if (x > right) {
        x = right;
    } else if (x < left) {
        x = left
    }
    if (y > top) {
        y = top;
    } else if (y < bottom) {
        y = bottom
    }

    return [x, y]
}

function clipLine(vertices, left, bottom, right, top) {
    let newVerts = []
    const inside = 0;
    const left = 1;
    const right = 2;
    const bottom = 4;
    const top = 8;

    let code = inside;
    for (let i = 0; i < vertices; i) {
        let x1 =
    }

    return newVerts
}

function cohenSutherlandCode(x, y, left, bottom, right, top) {
    if (x > right) {
        code |= right;
    } else if (x < left) {
        code |= left;
    }
    if (y > top) {
        code |= top;
    } else if (y < bottom) {
        code |= bottom;
    }
    return code;
}

//
//
// Assignment Template -- do not modfiy any code below this line
//
// -----------------------------------------------
//

let canvasw
let canvash
let canvasx
let canvasy

// polygon vertices to be clipped
let quad1
let quad2
let quad3
let quad4
let pent1
let hept1
let nona1
let deca1

// lines to be clipped
let line1
let line2
let line3
let line4
let line5
let line6

// line or poly mode
let doPoly = false

function drawClipRegion(llx, lly, urx, ury) {
    stroke(255, 255, 255)
    noFill()
    rect(llx, lly, urx - llx, ury - lly)
}

function drawClipLine() {
    // adjust for the shift in drawing space
    translate(canvasx, canvasy)

    drawClipRegion(50, 50, 250, 225)

    // first line: totally outside
    drawLine(line1, 255, 255, 255)
    clippedLine = clipLine(line1, 50, 50, 250, 225)
    drawLine(clippedLine, 255, 0, 0)

    // second line: totally inside
    drawLine(line2, 255, 255, 255)
    clippedLine = clipLine(line2, 50, 50, 250, 225)
    drawLine(clippedLine, 0, 255, 0)

    // third line: outside on left
    drawLine(line3, 255, 255, 255)
    clippedLine = clipLine(line3, 50, 50, 250, 225)
    drawLine(clippedLine, 0, 0, 255)

    // fourth line: outside on right
    drawLine(line4, 255, 255, 255)
    clippedLine = clipLine(line4, 50, 50, 250, 225)
    drawLine(clippedLine, 255, 0, 255)

    // fifth line: outside on right and left
    drawLine(line5, 255, 255, 255)
    clippedLine = clipLine(line5, 50, 50, 250, 225)
    drawLine(clippedLine, 0, 255, 255)

    // sixth line: cut on all sides
    drawLine(line6, 255, 255, 255)
    clippedLine = clipLine(line6, 50, 50, 250, 225)
    drawLine(clippedLine, 255, 255, 0)
}

function drawClipPoly() {
    // adjust for the shift in drawing space
    translate(canvasx, canvasy)

    // first polygon:  entirely within region
    drawClipRegion(10, 110, 50, 150)
    drawPolyEdges(quad1, 255, 0, 0)
    clippedPoly = clipPoly(quad1, 10, 110, 50, 150)
    drawFilledPoly(clippedPoly, 255, 0, 0)

    // second polygon: entirely outside region
    drawClipRegion(10, 110, 50, 150);
    drawPolyEdges(quad2, 0, 255, 0);
    clippedPoly = clipPoly(quad2, 10, 110, 50, 150);
    drawFilledPoly(clippedPoly, 255, 0, 0);

    // third polygon: halfway outside on left
    drawClipRegion(30, 10, 70, 80);
    drawPolyEdges(quad3, 0, 0, 255);
    clippedPoly = clipPoly(quad3, 30, 10, 70, 80);
    drawFilledPoly(clippedPoly, 0, 0, 255);

    // fourth polygon: part outside on right
    drawClipRegion(10, 110, 50, 150);
    drawPolyEdges(quad4, 255, 0, 255);
    clippedPoly = clipPoly(quad4, 10, 110, 50, 150);
    drawFilledPoly(clippedPoly, 255, 0, 255);

    // fifth polygon: outside on left and bottom
    drawClipRegion(90, 34, 120, 60);
    drawPolyEdges(pent1, 255, 128, 255);
    clippedPoly = clipPoly(pent1, 90, 34, 120, 60);
    drawFilledPoly(clippedPoly, 255, 128, 255);

    // sixth polygon:outside on top, right, and bottom
    drawClipRegion(90, 80, 130, 110);
    drawPolyEdges(hept1, 179, 179, 179);
    clippedPoly = clipPoly(hept1, 90, 80, 130, 110);
    drawFilledPoly(clippedPoly, 179, 179, 179);

    // seventh polygon: surrounds the clip region
    drawClipRegion(221, 80, 251, 101);
    drawPolyEdges(nona1, 222, 185, 134);
    clippedPoly = clipPoly(nona1, 221, 80, 251, 101);
    drawFilledPoly(clippedPoly, 222, 185, 134);

    // eighth polygon: outside on all 4 edges
    drawClipRegion(198, 198, 276, 258);
    drawPolyEdges(deca1, 255, 165, 0);
    clippedPoly = clipPoly(deca1, 198, 198, 276, 258);
    drawFilledPoly(clippedPoly, 255, 165, 0);
}

function drawCanvas() {
    // draw canvas background
    fill(0)
    rect(canvasx, canvasy, canvasw, canvash)

    // draw the axis
    stroke(0)
    textSize(10)
    textAlign(CENTER)
    for (i = 25; i < 300; i = i + 25) {
        // xaxis
        line(canvasx + i, canvasy, canvasx + i, canvasy - 10)
        text(str(i), canvasx + i, canvasy - 20)

        // y axis
        line(canvasx, canvasy + i, canvasx - 10, canvasy + i)
        text(str(i), canvasx - 22, canvasy + i + 4)
    }
}

function setup() {
    // set dimensions for drawing canvas
    canvasw = 300
    canvash = 300
    canvasx = 50
    canvasy = 50

    // polygons to be clipped definitions.
    quad1 = [20, 120, 20, 140, 40, 140, 40, 120]

    quad2 = [80, 160, 80, 200, 60, 200, 60, 160]

    quad3 = [20, 60, 50, 60, 50, 50, 20, 50]

    quad4 = [44, 122, 60, 122, 60, 146, 44, 146]

    pent1 = [80, 20, 90, 10, 110, 20, 100, 50, 80, 40]

    hept1 = [120, 70, 140, 70, 160, 80, 160, 100, 140, 110, 120, 100, 110, 90]

    nona1 = [
        190, 56, 230, 68, 247, 56, 269, 71, 284, 104, 251, 122, 233, 110, 212,
        119, 203, 95,
    ]

    deca1 = [
        177, 156, 222, 188, 267, 156, 250, 207, 294, 240, 240, 240, 222, 294,
        204, 240, 150, 240, 194, 207,
    ]

    // lines
    line1 = [25, 50, 20, 150]
    line2 = [75, 100, 100, 75]
    line3 = [25, 175, 100, 180]
    line4 = [200, 175, 275, 100]
    line5 = [175, 230, 275, 200]
    line6 = [25, 280, 280, 10]

    createCanvas(400, 400)
}

function drawPolyEdges(vertices, r, g, b) {
    stroke(r, g, b)
    noFill()
    beginShape()
    n = vertices.length / 2
    for (i = 0; i < n; i++) {
        let idx = i * 2
        let x = vertices.at(idx)
        let y = vertices.at(idx + 1)
        vertex(x, y)
    }
    endShape(CLOSE)
}

function drawFilledPoly(vertices, r, g, b) {
    noStroke()
    fill(r, g, b)
    beginShape()
    n = vertices.length / 2
    for (i = 0; i < n; i++) {
        let idx = i * 2
        let x = vertices.at(idx)
        let y = vertices.at(idx + 1)
        vertex(x, y)
    }
    endShape(CLOSE)
}

function drawLine(vertices, r, g, b) {
    stroke(r, g, b)
    line(vertices.at(0), vertices.at(1), vertices.at(2), vertices.at(3))
}

function draw() {
    background(220)

    // draw the canvas
    drawCanvas()

    // draw lines or poly
    if (doPoly) drawClipPoly()
    else drawClipLine()
}

function keyPressed() {
    doPoly = !doPoly
}
