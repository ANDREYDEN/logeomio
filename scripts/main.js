let logo;

function displayLogo() {
    let word = document.getElementById("word_input").value;
    logo = new Logo(word);
    
    logo.dividePolygons();
    logo.fillIn();
    resizeCanvas(width, logo.height*SCALE_FACTOR);
    scale(SCALE_FACTOR);
    logo.draw(true);
    scale(1/SCALE_FACTOR);

    return false;
} 

function preload() {
    FONT = loadFont('fonts/all-things-pink/All Things Pink Skinny.ttf');
}

function setup() {
    let canvas = createCanvas(WINDOW_CANVAS_RATIO*windowWidth, 500);
    // place th canvas in a div
    canvas.parent("sketch");

    strokeWeight(0.05);
    textSize(TEXT_SIZE);
    textFont(FONT);
    textAlign(CENTER, CENTER);
    pixelDensity(1);

    displayLogo();
}