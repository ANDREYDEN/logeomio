let logo;

/* FUNCTION: checks if the input word is in the correct format
 * RETURNS:
 *      float - the area of the polygon
 */
function validateAndFormat() {
    let word = document.getElementById("word-input").value
    word = word && word.trim()

    let errorMessage = document.getElementById("errorMessage")
    errorMessage.innerHTML = "";

    if (word.length < MIN_TEXT_LENGTH || word.length > MAX_TEXT_LENGTH) {
        errorMessage.innerHTML = `The name should be from ${MIN_TEXT_LENGTH} to ${MAX_TEXT_LENGTH} characters long`
    }
    return errorMessage.innerHTML === "" ? word : ""
}

function toggleLoadingScreen() {
    const canv = document.getElementById('sketch')
    const loading = document.getElementById('loading')
    const isLoading = canv.style.display === 'none'

    canv.style.display = isLoading ? 'block' : 'none'
    loading.style.display = isLoading ? 'none' : 'block'
}

function displayLogo(word) {
    toggleLoadingScreen()

    logo = new Logo(word);
    scaleFactor = width / logo.width;
    resizeCanvas(width, int(scaleFactor * logo.height), false);

    // routine
    logo.dividePolygons()
    print('Finished dividing. Total polygons: ' + logo.polygons.length);

    logo.fillIn(() => {
        // scale the canvas so that the logo width is reasonable
        toggleLoadingScreen()
        scale(scaleFactor)
        logo.draw(filledOnly = true)
    })
    console.log('Finished filling');



    return false;
}

//************************ P5 *************************/

function onSubmit() {
    const validationResult = validateAndFormat()
    if (validationResult) {
        displayLogo(validationResult)
    }
    return false;
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
    onSubmit();
}