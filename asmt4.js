firstLoop = true;
function logger(message) {
  if (firstLoop) { console.log(message) }
}

// Functions you need to write
function drawLine(x1, y1, x2, y2, r, g, b) {
  let x0 = x1, y0 = y1;
  x1 = x2, y1 = y2;

  // make sure slope is between 0 and 1
  let dy = y1 - y0;
  let dx = x1 - x0;
  const m = dy / dx;
  const validSlope = (Math.abs(dy) <= Math.abs(dx));
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

  let x = x0, y = y0;
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
  const points = [{ x: p1x, y: p1y }, { x: p2x, y: p2y }, { x: p3x, y: p3y }
  ];

  const xCoords = [...points.sort((a, b) => { return a.x - b.x })];
  const yCoords = [...points.sort((a, b) => {
    let res = a.y - b.y;
    if (res === 0) {
      res = a.x - b.x;
    }
    return res;
  })];

  // Order points in counter-clockwise order
  // start with smallest y coordinate
  let startPoint = yCoords[0];
  const egg = [p1, p2, p3] = [startPoint, ...xCoords.filter((point) => point !== startPoint)]
  fill(255, 0, 0)
  circle(p1.x, p1.y, 5)
  fill(0, 255, 0)
  circle(p2.x, p2.y, 5)
  fill(0, 0, 255,)
  circle(p3.x, p3.y, 5)


  logger(JSON.stringify(egg));


  const xMin = xCoords[0].x, xMax = xCoords[2].x;
  const yMin = yCoords[0].y, yMax = yCoords[2].y;

  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      const w0 = edge(p1.x, p1.y, p2.x, p2.y, x, y);
      const w1 = edge(p2.x, p2.y, p3.x, p3.y, x, y);
      const w2 = edge(p3.x, p3.y, p1.x, p1.y, x, y);

      if (w1 > 0 && w0 > 0 && w2 > 0) {
        setPixel(x, y, 255, 0, 0)
      }
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

//
//
// Assignment Template -- do not modfiy any code below this line
//
// -----------------------------------------------
//


let canvasw;
let canvash;
let canvasx;
let canvasy;

// lines to be clipped
let line1;
let line2;
let line3;
let line4;
let line5;
let line6;
let line7;
let line8;

// Teapots
let teapot1;
let teapot2;
let teapot3;
let teapot4;
let teapot5;
let teapot6;

// line or poly mode
let doLines = false

// processing or us
let doProcessing = false;

function setPixel(x, y, r, g, b) {
  // set the color
  stroke(r, g, b);

  //draw the point (already adjusted for placement of canvas in
  // drawTheLine and drawThePolys)
  point(x, y);
}

function drawCanvas() {

  // draw canvas background
  fill(0);
  rect(canvasx, canvasy, canvasw, canvash);

  // draw the axis
  stroke(0);
  textSize(10);
  textAlign(CENTER);
  for (let i = 25; i < 300; i = i + 25) {

    // xaxis
    line(canvasx + i, canvasy, canvasx + i, canvasy - 10);
    text(str(i), canvasx + i, canvasy - 20);

    // y axis
    line(canvasx, canvasy + i, canvasx - 10, canvasy + i);
    text(str(i), canvasx - 22, canvasy + i + 4);
  }
}

function drawThePolys() {

  // If doProcessing is true, we'll let processing draw the polys
  // otherwise, we will use our algorithm.
  if (doProcessing) {
    fill(255, 255, 255);
    noStroke();

    // adjust for axes
    translate(canvasx, canvasy);

    // the teapot
    triangle(teapot1[0], teapot1[1], teapot1[2], teapot1[3],
      teapot1[4], teapot1[5]);
    triangle(teapot2[0], teapot2[1], teapot2[2], teapot2[3],
      teapot2[4], teapot2[5]);
    triangle(teapot3[0], teapot3[1], teapot3[2], teapot3[3],
      teapot3[4], teapot3[5]);
    triangle(teapot4[0], teapot4[1], teapot4[2], teapot4[3],
      teapot4[4], teapot4[5]);
    triangle(teapot5[0], teapot5[1], teapot5[2], teapot5[3],
      teapot5[4], teapot5[5]);
    triangle(teapot6[0], teapot6[1], teapot6[2], teapot6[3],
      teapot6[4], teapot6[5]);
  }
  else {
    // we will draw in yellow
    const myr = 255;
    const myg = 255;
    const myb = 0;

    drawTriangle(teapot1[0] + canvasx, teapot1[1] + canvasy,
      teapot1[2] + canvasx, teapot1[3] + canvasy,
      teapot1[4] + canvasx, teapot1[5] + canvasy,
      myr, myg, myb);
    drawTriangle(teapot2[0] + canvasx, teapot2[1] + canvasy,
      teapot2[2] + canvasx, teapot2[3] + canvasy,
      teapot2[4] + canvasx, teapot2[5] + canvasy,
      myr, myg, myb);
    drawTriangle(teapot3[0] + canvasx, teapot3[1] + canvasy,
      teapot3[2] + canvasx, teapot3[3] + canvasy,
      teapot3[4] + canvasx, teapot3[5] + canvasy,
      myr, myg, myb);
    drawTriangle(teapot4[0] + canvasx, teapot4[1] + canvasy,
      teapot4[2] + canvasx, teapot4[3] + canvasy,
      teapot4[4] + canvasx, teapot4[5] + canvasy,
      myr, myg, myb);
    drawTriangle(teapot5[0] + canvasx, teapot5[1] + canvasy,
      teapot5[2] + canvasx, teapot5[3] + canvasy,
      teapot5[4] + canvasx, teapot5[5] + canvasy,
      myr, myg, myb);
    drawTriangle(teapot6[0] + canvasx, teapot6[1] + canvasy,
      teapot6[2] + canvasx, teapot6[3] + canvasy,
      teapot6[4] + canvasx, teapot6[5] + canvasy,
      myr, myg, myb);


  }
}

function drawTheLines() {
  // If doProcessing is true, we'll let processing draw the lines
  // otherwise, we will use our algorithm.
  if (doProcessing) {

    // we'll draw in white
    stroke(255, 255, 255);

    // adjust for axes
    translate(canvasx, canvasy);
    line(line1[0], line1[1], line1[2], line1[3]);
    line(line2[0], line2[1], line2[2], line2[3]);
    line(line3[0], line3[1], line3[2], line3[3]);
    line(line4[0], line4[1], line4[2], line4[3]);
    line(line5[0], line5[1], line5[2], line5[3]);
    line(line6[0], line6[1], line6[2], line6[3]);
    line(line7[0], line7[1], line7[2], line7[3]);
    line(line8[0], line8[1], line8[2], line8[3]);
  }

  else {
    // we will draw in yellow
    const myr = 255;
    const myg = 255;
    const myb = 0;

    // we'll need to adjust all vertices to account for axes
    // explicitely.
    drawLine(line1[0] + canvasx, line1[1] + canvasy,
      line1[2] + canvasx, line1[3] + canvasy,
      myr, myg, myb);
    drawLine(line2[0] + canvasx, line2[1] + canvasy,
      line2[2] + canvasx, line2[3] + canvasy,
      myr, myg, myb);
    drawLine(line3[0] + canvasx, line3[1] + canvasy,
      line3[2] + canvasx, line3[3] + canvasy,
      myr, myg, myb);
    drawLine(line4[0] + canvasx, line4[1] + canvasy,
      line4[2] + canvasx, line4[3] + canvasy,
      myr, myg, myb);
    drawLine(line5[0] + canvasx, line5[1] + canvasy,
      line5[2] + canvasx, line5[3] + canvasy,
      myr, myg, myb);
    drawLine(line7[0] + canvasx, line7[1] + canvasy,
      line7[2] + canvasx, line7[3] + canvasy,
      myr, myg, myb);
    drawLine(line8[0] + canvasx, line8[1] + canvasy,
      line8[2] + canvasx, line8[3] + canvasy,
      myr, myg, myb);
    drawLine(line6[0] + canvasx, line6[1] + canvasy,
      line6[2] + canvasx, line6[3] + canvasy,
      myr, myg, myb);
  }

}

function setup() {
  // set dimensions for drawing canvas
  canvasw = 300;
  canvash = 300;
  canvasx = 50;
  canvasy = 50;

  // triangles to be drawn
  // teapot
  teapot1 = [150, 150, 125, 50, 175, 50];
  teapot2 = [150, 150, 250, 125, 250, 175];
  teapot3 = [150, 150, 175, 250, 125, 250];
  teapot4 = [150, 150, 50, 175, 50, 125];
  teapot5 = [150, 150, 50, 225, 100, 175];
  teapot6 = [150, 150, 220, 50, 200, 100];

  // lines to be drawn
  line1 = [150, 50, 150, 250];
  line2 = [50, 150, 250, 150];
  line3 = [50, 50, 250, 250];
  line4 = [50, 250, 250, 50];
  line5 = [100, 50, 200, 250];
  line6 = [200, 50, 100, 250];
  line7 = [50, 100, 250, 200];
  line8 = [50, 200, 250, 100];

  createCanvas(400, 400);
}



function draw() {
  background(220);

  // draw the canvas
  drawCanvas();

  // draw lines or poly
  if (doLines) drawTheLines();
  else { drawThePolys(); firstLoop = false; }
}

function keyPressed() {
  // clear the canvas
  clear();

  if (key == 'l') doLines = !doLines;
  if (key == 'p') doProcessing = !doProcessing;
}