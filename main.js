let word = 'QWERTY';
var logo;

function preload() {
    FONT = loadFont('fonts/all-things-pink/All Things Pink Skinny.ttf');
}

function setup() {
    createCanvas(2000, 1000);
    strokeWeight(2);
    textSize(TEXT_SIZE);
    textFont(FONT);
    textAlign(CENTER, CENTER);
    pixelDensity(1);
    word = prompt('Enter a word:');
    logo = new Logo(word);
    logo.addLines(TOTAL_LINES);
}

function draw() {
    fill(RED, 0, 0);
    text(logo.word, logo.width/2, logo.height/2);
    logo.fillIn();
    logo.draw(true);
    noLoop();
}

function mousePressed() {
    let mouse = createVector(mouseX, mouseY);
    print(mouse);
    for (let polygon of logo.polygons) {
        if (polygon.contains(mouse))
            polygon.filled = true;
    }
}