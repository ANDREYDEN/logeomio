let logo;

function displayLogo() {
    let word = document.getElementById("word_input").value;
    let errorMessage = document.getElementById("errorMessage");
    errorMessage.innerHTML = "";
    
    if (word.length < 2 || word.length > 15) {
        errorMessage.innerHTML = "The name should be from 2 to 15 characters long";
    } else {
        logo = new Logo(word);
        scaleFactor = width / logo.width;
        resizeCanvas(width, scaleFactor * int(logo.height), false); // f***ing floats
        
        // routine
        logo.dividePolygons();
        logo.fillIn();
        // scale the canvas so that the logo width is reasonable
        scale(scaleFactor);
        logo.draw(filledOnly=true);
    }

    return false;
} 

function preload() {
    FONT = loadFont("fonts/all-things-pink/All Things Pink Skinny.ttf");
}

function setup() {
    let canvas = createCanvas(WINDOW_CANVAS_RATIO*windowWidth-15, 200);
    // place the canvas in a div
    canvas.parent("sketch");

    strokeWeight(0.05);
    textSize(TEXT_SIZE);
    textFont(FONT);
    textAlign(CENTER, CENTER);
    pixelDensity(1);

    displayLogo();
}