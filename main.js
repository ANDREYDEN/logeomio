let word = 'QWERTY';
let logo = new Logo(word);
const TOTAL_LINES = 50

function setup() {
    createCanvas(400, 400);
    word = prompt();
    logo.addLines(TOTAL_LINES);            
}

function draw() {
    ellipse(100, 100, 50);
    logo.draw();
}

function mousePressed() {
    let mouse = createVector(mouseX, mouseY);
    for (let polygon of logo.polygons) {
        if (polygon.contains(mouse))
            polygon.filled = true;
    }
}