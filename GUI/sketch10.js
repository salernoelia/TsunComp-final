function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);

    let yOffset = 100; // Adjust this value as needed

    // Define the coordinates of the quad in 3D space
    let x1 = 20;
    let y1 = 20 - yOffset;
    let x2 = 40;
    let y2 = 40 - yOffset;
    let x3 = 60;
    let y3 = 60 - yOffset;
    let x4 = 80;
    let y4 = 80 - yOffset;

    // Apply the isometric projection to the coordinates
    let isoX1 = x1 - y1 + width / 2;
    let isoY1 = (x1 + y1) * 0.5;
    let isoX2 = x2 - y2 + width / 2;
    let isoY2 = (x2 + y2) * 0.5;
    let isoX3 = x3 - y3 + width / 2;
    let isoY3 = (x3 + y3) * 0.5;
    let isoX4 = x4 - y4 + width / 2;
    let isoY4 = (x4 + y4) * 0.5;

    // Draw the isometric quad
    bezier(200, 200, 40, 40, 60, 20, 40, 0);
}
