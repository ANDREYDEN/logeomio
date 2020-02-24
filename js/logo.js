class Logo {
    /**
     * FUNCTION: constructs a Logo object
     * ARGS: 
     *      word: string - a word to be displayed
     */
    constructor(word) {
        this.word = word;
        let bounds = FONT.textBounds(word, 0, 0, TEXT_SIZE);
        this.width = bounds.w + 2 * PADDING;
        this.height = 2 * bounds.h;
        this.polygons = [new Polygon([
            createVector(0, 0),
            createVector(this.width, 0),
            createVector(this.width, this.height),
            createVector(0, this.height)
        ])];
    }

    /* (UNUSED)
     * FUNCTION: initializes the polygons data structure by splitting them with random lines
     * ARGS: 
     *      n: int - number of lines to split the polygons with
     */
    addLines(n) {
        for (let i = 0; i < n; i++) {
            let result = [];
            // choose 2 points on 2 different sides of the original rectangle and
            // split some of the polygons by a line defined by these points
            let side1 = Math.floor(random(4));
            let side2 = Math.floor(random(4));
            // if the sides are same, make them different
            if (side1 == side2)
                side1 = (side1 + 1) % 4;
            let pointOnRect = (side) => {
                if (side == 0)
                    return createVector(random(this.width), 0);
                else if (side == 1)
                    return createVector(this.width, random(this.height));
                else if (side == 2)
                    return createVector(random(this.width), this.height);
                else
                    return createVector(0, random(this.height));
            }
            let a = pointOnRect(side1), b = pointOnRect(side2);
            for (let polygon of this.polygons) {
                let [intersections, intersectedEdges] = polygon.intersectByLine(a, b);
                result = result.concat(polygon.split(intersections, intersectedEdges));
            }
            this.polygons = result;
        }
    }

    /* FUNCTION: initializes the polygons data structure by randomly dividing them in half
     * ARGS: 
     *      n: int - number of times to divide the polygons in half
     */
    dividePolygons(areaThreshold = MIN_AREA) {
        // consider only the polygons with big area
        let bigPolygons = this.polygons;
        let resultingPolygons = [];
        while (bigPolygons.length) {
            let polygon = bigPolygons.pop();
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

            // continue dividing if the polygon is still big enough
            let somePolygons = currentArea < areaThreshold ? resultingPolygons : bigPolygons
            somePolygons.push(...subPolygons)
        }
        this.polygons = resultingPolygons;
    }

    /* FUNCTION: fills the polygons according to the word (refreshes the canvas at the end) */
    drawWord() {
        fill(LOGO_COLOR, 0, 0);
        text(this.word, this.width / 2, this.height / 2);
    }

    /* FUNCTION: fills the polygons according to the word (refreshes the canvas at the end)*/
    fillIn(afterFill, pixelDistance = 1) {
        this.drawWord()

        loadPixels();
        console.log('Pixels loaded');
        let filledPixels = []
        for (let y = 0; y < this.height; y += pixelDistance) {
            for (let x = 0; x < this.width; x += pixelDistance) {
                if (pixels[(x + y * width) * 4] === LOGO_COLOR &&
                    pixels[(x + y * width) * 4 + 1] === 0) {
                    filledPixels.push({ x: x, y: y })
                }
            }
        }

        console.log('Determined filled pixels');

        // fill those polygons that contain word pixels
        this.determineFilledPolygons({ polygons: this.polygons, filledPixels: filledPixels, afterFill: afterFill })

        background(255);
    }

    determineFilledPolygons({ polygons, filledPixels, afterFill }) {
        const fillingWorker = new Worker('js/fillPolygonsWorker.js')

        const handleCompletion = message => {
            const resultingPolygons = message.data.polygons
            resultingPolygons.forEach((polygon, i) => {
                polygons[i].filled = polygon.filled
            })
            afterFill()

            fillingWorker.removeEventListener('message', handleCompletion)
        }

        fillingWorker.addEventListener('message', handleCompletion)

        const formatedPolygons = polygons.map(polygon => {
            return {
                edges: polygon.edges.map(edge => [{ x: edge[0].x, y: edge[0].y }, { x: edge[1].x, y: edge[1].y }]),
                filled: false
            }
        })
        fillingWorker.postMessage({ polygons: formatedPolygons, filledPixels: filledPixels })
    }

    /* FUNCTION: draws all polygons on a p5 canvas 
    *  ARGS:
    *       filledOnly: bool - draw only filled polygons
    *
    */
    draw(filledOnly = false) {
        this.polygons.forEach(polygon => {
            if (!filledOnly || polygon.filled) {
                polygon.draw();
            }
        })
    }
}