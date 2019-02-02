let logo;

function preload() {
    FONT = loadFont('fonts/all-things-pink/All Things Pink Skinny.ttf');
}

function setup() {
    createCanvas(2000, 1000);
    strokeWeight(0.05);
    textSize(TEXT_SIZE);
    textFont(FONT);
    textAlign(CENTER, CENTER);
    pixelDensity(1);
    word = prompt('Enter a word:');
    logo = new Logo(word);
    logo.dividePolygons();
}

function draw() {
    logo.fillIn();
    scale(3);
    logo.draw(true);
    noLoop();
}