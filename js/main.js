/** @type {Logo | undefined} */
let logo;
let scaleFactor = 1;
const settings = {
    animationEnabled: false,
    strokeEnabled: false,
};
let animationInProgress = false;

/**
 * Enables/disables submit button based on entered word.
 * @param {string} word - word to validate
 * @returns void
 */
function validateWord(word) {
    let errorMessage = document.getElementById("errorMessage")
    errorMessage.innerHTML = "";

    const submitButton = document.getElementById("submit")

    const isValid = MIN_TEXT_LENGTH <= word.length && word.length <= MAX_TEXT_LENGTH
    if (!isValid) {
        errorMessage.innerHTML = `The name should be from ${MIN_TEXT_LENGTH} to ${MAX_TEXT_LENGTH} characters long`
        submitButton.setAttribute('disabled', 'true')
    } else {
        submitButton.setAttribute('disabled', 'false')
    }
}

/** Turns animation on/off.  */
function toggleAnimation() {
    settings.animationEnabled = !settings.animationEnabled;
}

function toggleStroke() {
    settings.strokeEnabled = !settings.strokeEnabled;
}

function toggleLoadingScreen() {
    const canv = document.getElementById('sketch')
    const loading = document.getElementById('loading')
    const submitButton = document.getElementById('submit')
    const wasLoading = canv.style.display === 'none'

    canv.style.display = wasLoading ? 'block' : 'none'
    loading.style.display = wasLoading ? 'none' : 'block'
    submitButton.disabled = !wasLoading
}

//************************ P5 *************************/

function displayLogo(word) {
    logo = new Logo(word);
    logo.determineFilledPixels();

    if (settings.strokeEnabled) {
        strokeWeight(0.2);
        stroke(255, 0, 0);
    } else {
        noStroke();
    }

    if (settings.animationEnabled) {
        animationInProgress = true;
        return
    } 

    toggleLoadingScreen()

    scaleFactor = width / logo.width;
    resizeCanvas(width, int(scaleFactor * logo.height), false);

    // routine
    logo.dividePolygons()
    print('Finished dividing. Total polygons: ' + logo.resultingPolygons.length);

    logo.fillIn(() => {
        // scale the canvas so that the logo width is reasonable
        toggleLoadingScreen()
        scale(scaleFactor)
        logo.draw(filledOnly = false)
    })
    console.log('Finished filling');
}

function handleSubmit() {
    let word = document.getElementById("word-input").value
    displayLogo(word.trim())
    return false
}

function preload() {
    FONT = loadFont("fonts/All_Things_Pink.ttf");
}

function setup() {
    // create the canvas and place it in a div
    let canvas = createCanvas(int(WINDOW_CANVAS_RATIO * windowWidth) - 15, 200);
    canvas.parent("sketch");

    // configuration
    textSize(TEXT_SIZE);
    textFont(FONT);
    textAlign(CENTER, CENTER);
    pixelDensity(1);

    // display initial word
    handleSubmit();
}

function draw() {
    if (!animationInProgress) return

    // routine
    animationInProgress = logo.dividePolygon();
    logo.determineFilledPolygonsSync();
    scale(scaleFactor)
    logo.draw(filledOnly = false);
}