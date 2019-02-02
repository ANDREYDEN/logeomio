class Logo {
    /**
     * FUNCTION: constructs a Logo object
     * ARGS: 
     *      word: string - a word to be displayed
     */
    constructor(word) {
        this.word = word;
        let bounds = FONT.textBounds(word, 0, 0, TEXT_SIZE);
        this.width = bounds.w + 2*PADDING;
        this.height = 2*bounds.h;// + 2*PADDING;
        this.polygons = [new Polygon([
            createVector(0, 0),
            createVector(this.width, 0),
            createVector(this.width, this.height),
            createVector(0, this.height)
        ])];
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

    /* FUNCTION: initializes the polygons data structure by randomly dividing them in half
     * ARGS: 
     *      n: int - number of times to divide the polygons in half
     */
    dividePolygons(areaThreshold=MIN_AREA) {
        // consider only the polygons with big area
        let bigPolygons = this.polygons;
        let resultingPolygons = [];
        while (bigPolygons.length) {
            let polygon = bigPolygons[bigPolygons.length - 1];
            let currentArea = polygon.area();
            
            // pick to BIGGEST edges of the polygon
            let intersectedEdges = [0, 1];
            let edgeLengths = [0, 0];
            for (let i = 0; i < polygon.edges.length; i++) {
                let vertex1 = polygon.edges[i][0];
                let vertex2 = polygon.edges[i][1];
                let distance = vertex1.dist(vertex2);
                if (distance > edgeLengths[0]) {
                    edgeLengths[1] = edgeLengths[0];
                    edgeLengths[0] = distance;
                    intersectedEdges[1] = intersectedEdges[0];
                    intersectedEdges[0] = i;
                } else if (distance > edgeLengths[1]) {
                    edgeLengths[1] = distance;
                    intersectedEdges[1] = i;
                }
            }
            
            // pick to points on those edges
            let intersections = [polygon.pickPoint(intersectedEdges[0]),
                                 polygon.pickPoint(intersectedEdges[1])];
            
            let subPolygons = polygon.split(intersections, intersectedEdges);
            
            // if a subpolygon is still big enough, push it to bigPoygons
            // else push it to the resultingPolygons
            bigPolygons.pop();
            if (currentArea < areaThreshold) {
                resultingPolygons.push(subPolygons[0]);
                resultingPolygons.push(subPolygons[1]);
            } else {
                bigPolygons.push(subPolygons[0]);
                bigPolygons.push(subPolygons[1]);
            }
        }
        print('finished dividing');
        this.polygons = resultingPolygons;
    }



    /* FUNCTION: fills the polygons according to the word*/
    fillIn(pixelDistance=1) {
        // draw the actual word
        fill(RED, 0, 0);
        text(this.word, this.width / 2, this.height / 2);

        loadPixels();
        for (let y = 0; y < this.height; y += pixelDistance)
            for (let x = 0; x < this.width; x += pixelDistance) 
                if (pixels[(x + y * width) * 4] == RED && 
                    pixels[(x + y * width) * 4 + 1] == 0) {
                    for (let p of this.polygons)
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
    *
    */
    draw(filledOnly=false) {
        for (let polygon of this.polygons)
            if (filledOnly) {
                if (polygon.filled)
                    polygon.draw();  
            } else {
                polygon.draw();  
            }          
    }
}