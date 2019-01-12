let word = '';
let logo = new Logo();
const TOTAL_LINES = 50

function setup() {
    createCanvas(400, 400);
    word = prompt();
    logo.addLines(TOTAL_LINES);
    logo.initWord(word);                
}

function draw() {
    ellipse(100, 100, 50);
    logo.draw();
}
