function drawNameWithLines() {
    // insert your code here to draw the letters of your name
    // using only lines()
    // o
    let x = 30
    const y = x
    const space = 30
    const height = 80
    const width = 40

    // O
    line(x, y, x + width, y)
    line(x, y, x, y + height)
    line(x + width, y, x + width, y + height)
    line(x, y + height, x + width, y + height)

    // space
    x += space + width

    // R
    line(x, y, x + width, y)
    line(x, y, x, y + height)
    x += space + width

    // I
    line(x + width / 2, y, x + width / 2, y + height)
    x += space + width

    // O
    line(x, y, x + width, y)
    line(x, y, x, y + height)
    line(x + width, y, x + width, y + height)
    line(x, y + height, x + width, y + height)
    x += space + width

    // N
    line(x, y + height, x + width / 2, y)
    line(x + width / 2, y, x + width / 2, y + height)
    line(x + width / 2, y + height, x + width, y)
}

function drawNameWithTriangles() {
    const width = 30
    const height = 70
    const startX = 10
    const startY = 200
    const space = 30

    let x = startX
    let y = startY

    // o moment
    triangle(x, y, x + height, y, x, y + width)
    triangle(x + height, y + width, x + height, y, x, y + width)

    triangle(x, y, x + width, y, x, y + height)
    triangle(x + width, y + height, x + width, y, x, y + height)

    triangle(startX, startY, startX + width, startY, startX, startY + height)
    let xShift = x + width * 2
    triangle(xShift, y, xShift + width, y, xShift, y + height)
    triangle(xShift + width, y + height, xShift + width, y, xShift, y + height)
    y += height

    triangle(x, y, xShift + width, y, x, y + width)
    triangle(xShift + width, y + width, xShift + width, y, x, y + width)

    // r
    y = startY
    x += xShift + space
    triangle(x, y, x + width, y, x, y + height + width)
    triangle(x, y, x, y + width, x + height, y)

    x += space * 2.5
    // i
    //base
    triangle(x + width/3, y+height + width, x+width, y+height+ width, x + width/1.2, y+height/2)

    // Dot the i
    triangle(
        x + width / 2,
        y,
        x + width,
        y - height / 2,
        x + height - width / 2,
        y
    )

    triangle(
        x + width, y+width/2, // bottom
        x+width/2, y - height/3, //left
        x + height-width/2, y-width // right
    )

    x += space * 2.5
    // o moment
    triangle(x, y, x + height, y, x, y + width)
    triangle(x + height, y + width, x + height, y, x, y + width)

    triangle(x, y, x + width, y, x, y + height)
    triangle(x + width, y + height, x + width, y, x, y + height)

    triangle(startX, startY, startX + width, startY, startX, startY + height)
    xShift = x + width * 2
    triangle(xShift, y, xShift + width, y, xShift, y + height)
    triangle(xShift + width, y + height, xShift + width, y, xShift, y + height)
    y += height

    triangle(x, y, xShift + width, y, x, y + width)
    triangle(xShift + width, y + width, xShift + width, y, x, y + width)

    // n
    y = startY
    x += space * 4
    triangle(x, y, x + height, y, x, y + width)
    triangle(x + height, y + width, x + height, y, x, y + width)

    // triangle(startX, startY, startX + width, startY, startX, startY + height);
    triangle(x, y, x + width, y, x, y + height + width)
    triangle(x + width, y + height + width, x + width, y, x, y + height + width)

    xShift = x + width * 2
    // triangle(startX, startY, startX + width, startY, startX, startY + height + width)
    triangle(xShift, y, xShift + width, y, xShift, y + height + width)
    triangle(
        xShift + width,
        y + height + width,
        xShift + width,
        y,
        xShift,
        y + height + width
    )
}

// --------------------------------------------------------------------------------------------
//
//  Do not edit below this lne
//
// --------------------------------------------------------------------------------------------

let doLine = false
let doTri = false
let backgroundColor
let lineColor
let fillColor

function setup() {
    createCanvas(500, 500)
    backgroundColor = color(150, 150, 150)
    lineColor = color(0, 0, 0)
    fillColor = color(255, 0, 0)
    background(backgroundColor)
}

function draw() {
    if (doLine) stroke(lineColor)
    else stroke(backgroundColor)
    drawNameWithLines()

    if (doTri) {
        fill(fillColor)
        stroke(fillColor)
    } else {
        fill(backgroundColor)
        stroke(backgroundColor)
    }
    drawNameWithTriangles()
}

function keyPressed() {
    if (key == 'l') doLine = !doLine
    if (key == 't') doTri = !doTri
}
