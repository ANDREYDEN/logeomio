let logo;

function displayLogo() {
    let word = document.getElementById("word_input").value;
    logo = new Logo(word);
    //resizeCanvas(logo.width, logo.height+500);
    
    logo.dividePolygons();
    logo.fillIn();
    scale(SCALE_FACTOR);
    logo.draw(true);
    scale(1/SCALE_FACTOR);
}

function preload() {
    FONT = loadFont('fonts/all-things-pink/All Things Pink Skinny.ttf');
}

function setup() {
    let canvas = createCanvas(1000, 500);
    canvas.parent("sketch");

    strokeWeight(0.05);
    textSize(TEXT_SIZE);
    textFont(FONT);
    textAlign(CENTER, CENTER);
    pixelDensity(1);

    displayLogo();
}