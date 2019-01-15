let word = 'QWERTY';
var logo;
const TOTAL_LINES = 50;

function setup() {
    createCanvas(1600, 1600);
    strokeWeight(3);
    word = prompt('Enter a word:');
    logo = new Logo(word);
    logo.addLines(TOTAL_LINES);
}

function draw() {
    logo.draw();
}

function mousePressed() {
    let mouse = createVector(mouseX, mouseY);
    for (let polygon of logo.polygons) {
        if (polygon.contains(mouse))
            polygon.filled = true;
    }
}