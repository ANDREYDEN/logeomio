/** @type {Logo | undefined} */
let logo;
let scaleFactor = 1;
/** @type {'text' | 'image'} */
let inputType = 'text';
const settings = {
    animationEnabled: false,
    strokeEnabled: false,
    randomColorsEnabled: false,
};
let animationInProgress = false;
/** @type {p5.Image} */
let uploadedImage;

/** @type {HTMLInputElement | undefined} */
let textInput;
/** @type {HTMLInputElement | undefined} */
let imagePickerInput;
/** @type {HTMLButtonElement | undefined} */
let submitButton;

document.addEventListener("DOMContentLoaded", () => {
    submitButton = document.getElementById("submit")
    textInput = document.getElementById("word-input");
    textInput.addEventListener("input", (e) => {
        validateWord(e.target.value);
    });

    imagePickerInput = document.getElementById("image-picker");
    imagePickerInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        loadImage(url, (img) => {
            uploadedImage = img;
            submitButton.removeAttribute('disabled');
        });
    });
})

/**
 * Enables/disables submit button based on entered word.
 * @param {string} word - word to validate
 * @returns void
 */
function validateWord(word) {
    let errorMessage = document.getElementById("errorMessage")
    errorMessage.innerHTML = "";

    const isValid = MIN_TEXT_LENGTH <= word.length && word.length <= MAX_TEXT_LENGTH
    if (!isValid) {
        errorMessage.innerHTML = `The input should be from ${MIN_TEXT_LENGTH} to ${MAX_TEXT_LENGTH} characters long`
        submitButton.setAttribute('disabled', 'true')
    } else {
        submitButton.removeAttribute('disabled')
    }
}

/** Turns animation on/off.  */
function toggleAnimation() {
    settings.animationEnabled = !settings.animationEnabled;
}

function toggleStroke() {
    settings.strokeEnabled = !settings.strokeEnabled;
}

function toggleRandomColors() {
    settings.randomColorsEnabled = !settings.randomColorsEnabled;
}

/**
 * @param {'text' | 'image' } type 
 */
function changeInputType(type) {
    inputType = type;

    if (inputType === 'text') {
        textInput.classList.remove('hidden')
        imagePickerInput.classList.add('hidden')
        validateWord(textInput.value)
    } else if (inputType === 'image') {
        if (!uploadedImage) {
            submitButton.setAttribute('disabled', 'true')
        }
        textInput.classList.add('hidden')
        imagePickerInput.classList.remove('hidden')
    }
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
    logo = new Logo();

    if (inputType === 'text') {
        logo.initializeFromWord(word, { withRandomColors: settings.randomColorsEnabled });
    } else if (inputType === 'image' && uploadedImage) {
        logo.initializeFromImage(uploadedImage);
    }

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

    toggleLoadingScreen()
    scale(scaleFactor)
    logo.draw(filledOnly = false)
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
    scale(scaleFactor)
    logo.draw(filledOnly = false);
}