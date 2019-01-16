let word = 'QWERTY';
var logo;

function preload() {
    FONT = loadFont('fonts/Marlboro/Marlboro.ttf');
}

function setup() {
    createCanvas(1000, 1000);
    strokeWeight(3);
    textSize(TEXT_SIZE);
    textFont(FONT);
    textAlign(CENTER, CENTER);
    word = prompt('Enter a word:');
    logo = new Logo(word);
    logo.addLines(TOTAL_LINES);
}

function draw() {
    logo.draw();
    fill(145, 0, 0);
    text(logo.word, logo.width/2, logo.height/2);
    
    logo.fillIn();
    
    logo.draw();
    fill(145, 0, 0);
    text(logo.word, logo.width/2, logo.height/2);
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