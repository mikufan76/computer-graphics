// Functions you need to write
function drawLine(x1, y1, x2, y2, r, g, b) {
  let x0, y0;
  // Algo must go from left to right
  console.log(`X: ${x1}, ${x2}\nY: ${y1}, ${y2}`)
  if (x1 < x2) {
    // swap!
    console.log(`Not l to r!`)
    x0 = x2;
    y0 = y2;
  } else {
    // already l to r
    x0 = x1;
    x1 = x2;
    y0 = y1;
    y1 = y2;
  }

  // make sure slope is between 0 and 1
  let dy = y1 - y0;
  let dx = x0 - x1;
  const m = Math.abs(dy / dx);
  console.log(`dy: ${dy}, dx: ${dx}, ${m}\n${m > 1}`)

  // slope is not! swap coordinates
  if (m > 1) {
    const temp = [x0, x1];
    x0 = y0;
    x1 = y1;

    y0 = temp[0];
    y1 = temp[1];

  }

  dy = y1 - y0;
  dx = Math.abs(x0 - x1);

  // east delta
  const dE = 2 * dy;
  // north east delta
  const dNe = 2 * (dy - dx);
  // decision param: east or north east
  let d = dE - dx; // 2*dy-dx

  console.log(`dx: ${dx}\ndy: ${dy}\nDE: ${dE}\ndNE: ${dNe}\nd: ${d}`);

  let x = x0, y = y0;
  const yDir = y0 > y1 ? -1 : 1;

  for (x; x <= x1; x++) {
    m < 1 ? setPixel(x, y, r, g, b) : setPixel(y, x, r, g, b);
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
  console.log(`Final D: ${d}`)

}

function drawTriangle(p1x, p1y, p2x, p2y, p3x, p3y, r, g, b) {

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
let doLines = true;

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
    // line(line2[0], line2[1], line2[2], line2[3]);
    // line(line3[0], line3[1], line3[2], line3[3]);
    // line(line4[0], line4[1], line4[2], line4[3]);
    // line(line5[0], line5[1], line5[2], line5[3]);
    // line(line6[0], line6[1], line6[2], line6[3]);
    // line(line7[0], line7[1], line7[2], line7[3]);
    // line(line8[0], line8[1], line8[2], line8[3]);
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
    // drawLine(line2[0] + canvasx, line2[1] + canvasy,
    //   line2[2] + canvasx, line2[3] + canvasy,
    //   myr, myg, myb);
    // drawLine(line3[0] + canvasx, line3[1] + canvasy,
    //   line3[2] + canvasx, line3[3] + canvasy,
    //   myr, myg, myb);
    // drawLine(line4[0] + canvasx, line4[1] + canvasy,
    //   line4[2] + canvasx, line4[3] + canvasy,
    //   myr, myg, myb);
    // drawLine(line5[0] + canvasx, line5[1] + canvasy,
    //   line5[2] + canvasx, line5[3] + canvasy,
    //   myr, myg, myb);
    // drawLine(line6[0] + canvasx, line6[1] + canvasy,
    //   line6[2] + canvasx, line6[3] + canvasy,
    //   myr, myg, myb);
    // drawLine(line7[0] + canvasx, line7[1] + canvasy,
    //   line7[2] + canvasx, line7[3] + canvasy,
    //   myr, myg, myb);
    // drawLine(line8[0] + canvasx, line8[1] + canvasy,
    //   line8[2] + canvasx, line8[3] + canvasy,
    //   myr, myg, myb);
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
  else drawThePolys();
}

function keyPressed() {
  // clear the canvas
  clear();

  if (key == 'l') doLines = !doLines;
  if (key == 'p') doProcessing = !doProcessing;
}