class Logo {
    /**
     * FUNCTION: constructs a Logo object
     */
    constructor() {
        /** @type {Polygon[]} */
        this.resultingPolygons = []
        this.logoPixels = []
    }

    /** @param {string} word */
    initializeFromWord(word) {
        let bounds = FONT.textBounds(word, 0, 0, TEXT_SIZE);
        this.width = bounds.w + 2 * PADDING;
        this.height = 2 * bounds.h;

        this.polygonsToProcess = [new Polygon([
            new Vector(0, 0),
            new Vector(this.width, 0),
            new Vector(this.width, this.height),
            new Vector(0, this.height)
        ])];

        const wordColor = 145
        this.#drawWord(word, wordColor)
        this.#determineFilledPixels({ color: wordColor })
    }

    /** @param {p5.Image} img */
    initializeFromImage(img) {
        this.width = img.width;
        this.height = img.height;

        this.polygonsToProcess = [new Polygon([
            new Vector(0, 0),
            new Vector(this.width, 0),
            new Vector(this.width, this.height),
            new Vector(0, this.height)
        ])];

        if (width < height) {
            img.resize(width, 0)
        } else {
            img.resize(0, height)
        }
        background(255);
        image(img, width / 2 - img.width / 2, height / 2 - img.height / 2);
        this.#determineFilledPixels({ color: 0 })
    }

    #determineFilledPixels({ color, pixelDistance = 1 } = {}) {
        this.logoPixels = []
        loadPixels();
        console.log('Pixels loaded');
        for (let y = 0; y < this.height; y += pixelDistance) {
            for (let x = 0; x < this.width; x += pixelDistance) {
                if (pixels[(x + y * width) * 4] === color) {
                    this.logoPixels.push({ x: x, y: y })
                }
            }
        }

        console.log(`Determined filled pixels ${this.logoPixels.length}`);
        background(255)
    }

    /* FUNCTION: fills the polygons according to the word (refreshes the canvas at the end) */
    #drawWord(word, wordColor) {
        fill(wordColor);
        text(word, this.width / 2, this.height / 2);
    }

    /* FUNCTION: initializes the polygons data structure by randomly dividing them in half */
    dividePolygons() {
        while (this.polygonsToProcess.length) {
            this.dividePolygon()
        }
    }

    dividePolygon(areaThreshold = MIN_AREA) {
        if (this.polygonsToProcess.length === 0) return false;

        const polygon = this.polygonsToProcess.pop()
        let currentArea = polygon.area();

        // pick 2 BIGGEST edges of the polygon
        let top2Edges = [0, 1];
        polygon.edges.forEach((edge, i) => {
            if (i === 0) return
            let newLength = Polygon.edgeLen(edge)
            let top2Lengths = top2Edges.map(idx => Polygon.edgeLen(polygon.edges[idx]))
            if (newLength > top2Lengths[0]) {
                top2Edges = [i, top2Edges[0]]
            } else if (newLength > top2Lengths[1]) {
                top2Edges = [top2Edges[0], i]
            }
        })

        // split the polygon in 2 smaller ones
        let intersections = top2Edges.map(polygon.pickPoint.bind(polygon))
        let subPolygons = polygon.split(intersections, top2Edges)

        // continue dividing if the polygon is still big enough and not uniform
        for (const subPolygon of subPolygons) {
            const { isUniform, averageColor } = this.#getAverageColor(subPolygon);
            subPolygon.uniform = isUniform;
            subPolygon.color = averageColor;

            if (currentArea < areaThreshold) {
                this.resultingPolygons.push(subPolygon)
                continue;
            }

            if (subPolygon.uniform) {
                this.resultingPolygons.push(subPolygon)
            } else {
                this.polygonsToProcess.push(subPolygon)
            }
        }

        return true;
    }

    /**
     * Determines the average color of the polygon and whether it is uniform (of approximately the same color).
     * @param {Polygon} polygon 
     * @returns {{ averageColor: p5.Color, isUniform: boolean }}
     */
    #getAverageColor(polygon) {
        // const boundingRect = polygon.boundingRect();
        // const allCoordsInPolygon = [];
        // for (let y = Math.floor(boundingRect.top); y <= Math.floor(boundingRect.bottom); y++) {
        //     for (let x = Math.floor(boundingRect.left); x <= Math.floor(boundingRect.right); x++) {
        //         if (polygon.contains({x, y})) {
        //             allCoordsInPolygon.push({ x, y });
        //         }
        //     }
        // }

        // const redundantPoints = 1 + Math.floor(allCoordsInPolygon.length / 1000);
        // const coordsInPolygon = allCoordsInPolygon.filter((_, i) => i % redundantPoints === 0);

        const coordsInPolygon = this.logoPixels.filter(coord => polygon.contains(coord));

        if (coordsInPolygon.length === 0) {
            return {
                averageColor: color(255),
                isUniform: true
            }
        }

        return {
            averageColor: color(0),
            isUniform: false
        }

        const maxDistance = 0;
        const colorSum = { r: 0, g: 0, b: 0 };
        for (const coord of coordsInPolygon) {
            const pixelColor = this.#pixelColor(coord.x, coord.y);
            const [red, green, blue] = pixelColor;
            colorSum.r += red;
            colorSum.g += green;
            colorSum.b += blue;

            for (const otherCoord of coordsInPolygon) {
                const otherPixelColor = this.#pixelColor(otherCoord.x, otherCoord.y);
                const distance = dist(...pixelColor, ...otherPixelColor);
                if (distance > maxDistance) {
                    maxDistance = distance;
                }
            }
        }

        return  {
            averageColor: color(
                colorSum.r / coordsInPolygon.length,
                colorSum.g / coordsInPolygon.length,
                colorSum.b / coordsInPolygon.length
            ),
            isUniform: maxDistance < MAX_UNIFORMITY_DISTANCE
        }
    }

    #pixelColor(x, y) {
        return [0, 0, 0];

        const idx = (x + y * width) * 4;
        return [pixels[idx], pixels[idx + 1], pixels[idx + 2]];
    }

    /**
     * Draws polygons on the canvas. 
     */
    draw({ withRandomColors = false, filledThreshold = 128 } = {}) {
        const logoColor = getRandomColor(); 

        for (const polygon of this.resultingPolygons) { 
            if (withRandomColors) {
                const isFilled = polygon.hasColorHigherThan(filledThreshold);

                polygon.draw(isFilled ? logoColor : getRandomColor());
                continue;
            }

            polygon.draw();
        }

        for (const polygon of this.polygonsToProcess) { 
            polygon.draw();
        }
    }
}

function getRandomColor() {
    colorMode(HSL);
    const result = color(random(360), 50, 70);
    colorMode(RGB);
    return result;
}