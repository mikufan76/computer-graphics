// You need to fill in the following functions.
function drawArtwork() {

}

function drawWarhol() {

}

function drawZoom() {

}


// Do not edit code below this line
// ------------------------------
//

let whichDraw = 1;

function setPixel (x, y, r, g, b) {
  stroke (r,g,b);
  point (x,y)
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
  if (key == "1") whichDraw = 1;
  if (key == "2") whichDraw = 2;
  if (key == "3") whichDraw = 3;

  redraw();
}