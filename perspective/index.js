import three from './threejs-math.js';
const { Vector2 } = three;

const canvas = document.getElementById('canvas');

// for lighting, get angle between the normal of the plane + the light source

if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const origin = new Vector2(width / 2, height / 2);
    ctx.translate(origin.x, origin.y);
    ctx.fillStyle = 'red';
    ctx.fillRect(origin.x, origin.y, 1, 1);
    // drawing code here

    const squareWidth = 50;
    const square = {
        width: squareWidth,
        height: squareWidth,
        depth: squareWidth,
        // x: -squareWidth / 2 + 200,
        x: -squareWidth / 2,
        y: 100,
    };

    const square2 = {
        width: squareWidth,
        height: squareWidth,
        depth: squareWidth,
        x: -squareWidth / 2 + 200,
        // x: -squareWidth / 2,
        y: 100,
    };

    const square3 = {
        width: squareWidth,
        height: squareWidth,
        depth: squareWidth,
        x: -squareWidth / 2 - 200,
        // x: -squareWidth / 2,
        y: 100,
    };
    const square4 = {
        width: squareWidth,
        height: squareWidth,
        depth: squareWidth,
        x: 0 - squareWidth / 2,
        // x: -squareWidth / 2,
        y: -squareWidth / 2,
    };

    const square5 = {
        width: squareWidth,
        height: squareWidth,
        depth: squareWidth,
        x: 0 - squareWidth / 2,
        // x: -squareWidth / 2,
        y: -200,
    };

    drawsquare(ctx, square, origin);
    drawsquare(ctx, square2, origin);
    drawsquare(ctx, square3, origin);
    drawsquare(ctx, square5, origin);
    // drawsquare(ctx, square4, origin);
} else {
    // canvas-unsupported code here
}

function drawsquare(ctx, square, origin) {
    const vec_1 = new Vector2(square.x, square.y);
    const vec_2 = new Vector2(square.x + square.width, square.y);
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'pink';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(vec_1.x, vec_1.y);
    ctx.stroke();

    ctx.strokeStyle = 'pink';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(vec_2.x, vec_2.y);
    ctx.stroke();

    ctx.fillRect(square.x, square.y, square.width, square.height);

    ctx.beginPath();
    ctx.moveTo(square.x, square.y);
    ctx.lineTo(0, 0);
    ctx.lineTo(square.x + square.width, square.y);
    ctx.stroke();

    const dot = vec_1.dot(vec_2);
    const angle = dot / (vec_2.length() * vec_1.length());
    const new_depth = Math.sin(angle);
    console.log(new_depth);

    const depthDir = new Vector2(vec_1.x, vec_1.y).multiplyScalar(new_depth);
    const depthDir2 = new Vector2(vec_2.x, vec_2.y).multiplyScalar(new_depth);
    console.log(depthDir.y - vec_1.y);
    console.log(depthDir, vec_1.y);
    if (0 < square.y) {
        ctx.beginPath();
        ctx.moveTo(vec_1.x, vec_1.y);
        ctx.lineTo(depthDir.x, depthDir.y);
        ctx.lineTo(depthDir2.x, depthDir2.y);
        ctx.lineTo(vec_2.x, vec_2.y);
        ctx.fillStyle = '#0080FF';
        ctx.fill();
    }

    const leftBottom = new Vector2(vec_1.x, vec_1.y + square.height);
    const left = new Vector2(depthDir.x, depthDir.y);

    if (square.x > 0) {
        ctx.beginPath();
        ctx.moveTo(leftBottom.x, leftBottom.y);
        ctx.lineTo(0, 0);
        ctx.stroke();

        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(left.x, left.y + square.height);
        ctx.stroke();

        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(leftBottom.x, leftBottom.y);
        ctx.lineTo(0, 0);
        ctx.stroke();
    }
}
