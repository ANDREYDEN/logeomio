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
        this.height = 2*bounds.h;
        this.currentPolygons = [new Polygon([
            createVector(0, 0),
            createVector(this.width, 0),
            createVector(this.width, this.height),
            createVector(0, this.height)
        ])];
        this.currentPolygons[0].filled = true;
        this.resultingPolygons = [];
    }

    /* FUNCTION: returns all the polygons in the division
    *  RETURNS:
    *      n: Polygon[] - array of all the polygons in the division
    */
    getAllPolygons() {
        return this.currentPolygons.concat(this.resultingPolygons);
    }

    /* FUNCTION: initializes the polygons data structure by splitting them with random lines
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
                side1 = (side1 + 1)%4;
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

    /* FUNCTION: picks one polygon from the polygons data structure and randomly divides it in half
     * ARGS: 
     *      areaThreshold: double - the minimal area of a polygon
     * RETURNS:
     *      bool: true if the division was successfull
     */
    dividePolygon(areaThreshold=MIN_AREA) {
        if (this.currentPolygons.length == 0) return false;

        // take a polygon to cut 
        let polygon = this.currentPolygons.pop();

        // if the polygon does not cover any of the pixels of the message
        // there is no sense to divide it
        if (!polygon.filled) {
            this.resultingPolygons.push(polygon);
            return true;
        }

        // pick to BIGGEST edges of the polygon
        let intersectedEdges = [0, 1]; // indecies of intersected edges
        let edgeLengths = [0, 0];

        polygon.edges.forEach((edge, i) => {
            let vertex1 = edge[0];
            let vertex2 = edge[1];
            let distance = vertex1.dist(vertex2);
            if (distance > edgeLengths[0]) {
                edgeLengths = [distance, edgeLengths[0]]
                intersectedEdges = [i, intersectedEdges[0]]
            } else if (distance > edgeLengths[1]) {
                edgeLengths[1] = distance;
                intersectedEdges[1] = i;
            }
        })

        // pick 2 points on the selected edges
        let intersections = [
            polygon.pickPoint(intersectedEdges[0]),
            polygon.pickPoint(intersectedEdges[1])
        ];

        // split the polygon in half
        let subPolygons = polygon.split(intersections, intersectedEdges);

        // if the selected polygon was still big enough, push its halves to currentPolygons
        // else push the halves to the resultingPolygons
        if (polygon.area() > areaThreshold) {
            this.currentPolygons.push(subPolygons[0], subPolygons[1]);
        } else {
            this.resultingPolygons.push(subPolygons[0], subPolygons[1]);
        }

        // console.log('cur:', this.currentPolygons.length);
        // console.log('res:', this.resultingPolygons.length);
        return true;
    }

    /* FUNCTION: fills the polygons according to the word (refreshes the canvas at the end)*/
    fillIn(pixelDistance=1) {
        // draw the actual word
        fill(RED, 0, 0);
        text(this.word, this.width / 2, this.height / 2);

        // fill those polygons that intersect the word
        loadPixels();
        for (let y = 0; y < this.height; y += pixelDistance)
            for (let x = 0; x < this.width; x += pixelDistance) 
                if (pixels[(x + y * width) * 4] == RED && 
                    pixels[(x + y * width) * 4 + 1] == 0) {
                    // iterate over all of the polygons
                    for (let p of this.getAllPolygons())
                        if (p.contains(createVector(x, y))) {
                            p.filled = true;
                            break;
                        }      
                }
        background(255);
    }

    /* FUNCTION: draws all polygons on a p5 canvas 
    *  ARGS:
    *       filledOnly: bool - draw only filled polygons
    */
    draw(filledOnly=false) {
        for (let polygon of this.getAllPolygons()) {
            if (!filledOnly || (filledOnly && polygon.filled)) {
                polygon.draw();  
            }       
        }   
    }
}