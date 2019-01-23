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
    //logo.addLines(POLYGONS);
    logo.dividePolygons(POLYGONS);
}

function draw() {
    //logo.fillIn(10);
    logo.draw();
    noLoop();
}