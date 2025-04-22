import three from './threejs-math.js';
const { Vector2 } = three;

const canvas = document.getElementById('canvas');

if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const origin = new Vector2(width / 2, height / 2);
    ctx.translate(origin.x, origin.y);
    ctx.fillStyle = 'red';
    ctx.fillRect(origin.x, origin.y, 1, 1);
    // drawing code here

    ctx.fillStyle = 'blue';

    const squareWidth = 50;
    const square = {
        width: squareWidth,
        height: squareWidth,
        depth: squareWidth,
        x: -squareWidth / 2 + 200,
        y: 100,
    };

    const vec_1 = new Vector2(square.x, square.y);
    const vec_2 = new Vector2(square.x + square.width, square.y);

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
    ctx.stroke()

    const dot = vec_1.dot(vec_2);
    const angle = dot / (vec_2.length() * vec_1.length());
    const new_depth = Math.sin(angle);
    console.log(new_depth);

    const depthDir = new Vector2(vec_1.x, vec_1.y).multiplyScalar(new_depth);
    const depthDir2 = new Vector2(vec_2.x, vec_2.y).multiplyScalar(new_depth);
    console.log(depthDir.y-vec_1.y);
    console.log(depthDir, vec_1.y);
    ctx.beginPath();
    ctx.moveTo(vec_1.x, vec_1.y);
    ctx.lineTo(depthDir.x, depthDir.y);
    ctx.lineTo(depthDir2.x, depthDir2.y);
    ctx.lineTo(vec_2.x, vec_2.y);
    ctx.fillStyle = '#0080FF';
    ctx.fill();

    const leftBottom = new Vector2(vec_1.x, vec_1.y + square.height);
    ctx.beginPath();
    ctx.moveTo(leftBottom.x, leftBottom.y);
    ctx.lineTo(0,0);
    ctx.stroke()

    const left = new Vector2(depthDir.x, depthDir.y);

    if (square.x > 0) {
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(left.x, left.y + square.height);
        ctx.stroke()

    }

} else {
    // canvas-unsupported code here
}
