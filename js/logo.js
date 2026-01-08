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
        this.polygonsToProcess = [new Polygon([
            new Vector(0, 0),
            new Vector(this.width, 0),
            new Vector(this.width, this.height),
            new Vector(0, this.height)
        ])];
        /** @type {Polygon[]} */
        this.resultingPolygons = []
        this.filledPixels = []
    }

    determineFilledPixels({ pixelDistance = 1 } = {}) {
        this.drawWord()

        loadPixels();
        console.log('Pixels loaded');
        for (let y = 0; y < this.height; y += pixelDistance) {
            for (let x = 0; x < this.width; x += pixelDistance) {
                if (pixels[(x + y * width) * 4] === LOGO_COLOR &&
                    pixels[(x + y * width) * 4 + 1] === 0) {
                    this.filledPixels.push({ x: x, y: y })
                }
            }
        }

        console.log('Determined filled pixels');
        background(255)
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
                    return new Vector(random(this.width), 0);
                else if (side == 1)
                    return new Vector(this.width, random(this.height));
                else if (side == 2)
                    return new Vector(random(this.width), this.height);
                else
                    return new Vector(0, random(this.height));
            }
            let a = pointOnRect(side1), b = pointOnRect(side2);
            for (let polygon of this.polygonsToProcess) {
                let [intersections, intersectedEdges] = polygon.intersectByLine(a, b);
                result = result.concat(polygon.split(intersections, intersectedEdges));
            }
            this.polygonsToProcess = result;
        }
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

        // continue dividing if the polygon is still big enough
        for (const subPolygon of subPolygons) {
            subPolygon.filled = this.isFilled(subPolygon);
            if (currentArea < areaThreshold) {
                this.resultingPolygons.push(subPolygon)
            } else {
                if (subPolygon.filled) {
                    this.polygonsToProcess.push(subPolygon)
                } else {
                    this.resultingPolygons.push(subPolygon)
                }
            }
        }

        return true;
    }

    /* FUNCTION: fills the polygons according to the word (refreshes the canvas at the end) */
    drawWord() {
        fill(LOGO_COLOR, 0, 0);
        text(this.word, this.width / 2, this.height / 2);
    }

    isFilled(polygon) {
        for (const pixel of this.filledPixels) {
            if (Polygon.contains(polygon, pixel)) {
                return true;
            }
        }
        return false;
    }

    /* FUNCTION: draws all polygons on a p5 canvas 
    *  ARGS:
    *       filledOnly: bool - draw only filled polygons
    */
    draw(filledOnly = false) {
        for (const polygon of this.resultingPolygons) { 
            if (!filledOnly || polygon.filled) {
                polygon.draw();
            }
        }

        for (const polygon of this.polygonsToProcess) { 
            if (!filledOnly || polygon.filled) {
                polygon.draw({ isProcessing: true });
            }
        }
    }
}