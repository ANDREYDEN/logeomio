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
        this.graphics = createGraphics(this.width, this.height);
        this.graphics.text(word, 0, 0);
    }

    /* FUNCTION: initializes the polygons data structure
     * ARGS: 
     *      n: int - number of lines to split the logo with
     */
    addLines(n) {
        for (let i = 0; i < n; i++) {
            let result = [];
            let side1 = Math.floor(random(4));
            let side2 = Math.floor(random(4));
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
                for (let polygon of this.polygons)
                result = result.concat(polygon.split(a, b));
            this.polygons = result;
        }
    }

    /* FUNCTION: fills the polygons according to the word*/
    fillIn(pixelDistance=1) {
        loadPixels();
        for (let y = 0; y < height; y += pixelDistance)
            for (let x = 0; x < width; x += pixelDistance) 
                if (pixels[(x + y * width) * 4] == RED && pixels[(x + y * width) * 4 + 1] == 0) {
                    for (let p of this.polygons)
                        if (p.contains(createVector(x, y))) {
                            p.filled = true;
                            break;
                        }      
                }
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

class Polygon {
    /* FUNCTION: constructor
     * ARGS: 
     *      vertexes: p5.Vector[] - points that define the polygon
     */    
    constructor(vertexes) {
        this.edges = [];
        let n = vertexes.length;
        for (let i = 0; i < n; i++) {
            this.edges.push([vertexes[i], vertexes[(i+1)%n]]);
        }
        this.filled = false;
    }

    /* FUNCTION: finds segment-line intersection
     * ARGS: 
     *      segment, line: [p5.Vector, p5.Vector] - points that define the segment and the line
     * RETURNS:
     *      p5.Vector - coordinates of the intersection, or null if there is no intersection
     */
    static intersect(edge, line) {
        let [x1, y1] = [edge[0].x, edge[0].y];
        let [x2, y2] = [edge[1].x, edge[1].y];
        let [x3, y3] = [line[0].x, line[0].y];
        let [x4, y4] = [line[1].x, line[1].y];
        let x = 0;
        if (abs(x3-x4) < EPS)
            x = x3;
        else
            x = ((x1-x2)*(x3*y4 - x4*y3) + (x3-x4)*(x2*y1 - x1*y2))/
                ((y1-y2)*(x3-x4) - (y3-y4)*(x1-x2));
        let y = (x-x3)*(y3-y4)/(x3-x4) + y3;
        if (((x-x1 > -EPS && x2-x > -EPS) || (x1-x > -EPS && x-x2 > -EPS)) && 
            ((y-y1 > -EPS && y2-y > -EPS) || (y1-y > -EPS && y-y2 > -EPS)))
            return createVector(x, y);
    }

    /* FUNCTION: splits a given polygon by a given line
     * ARGS: 
     *      a, b: p5.Vectors - points that define a splitting line
     * RETURNS:
     *      Polygon[]: array of polygons as a result of splitting,
     *                 either one (same) polygon if not affected,
     *                 or two new polygons
     */
    split(a, b) {
        let intersections = []; // coordinates of intersections
        let intersectedEdges = []; // numbers of intersected edges
        let splitLine = [a, b];
        // for each edge log intersections and intersected edges
        for (let i = 0; i < this.edges.length; i++) {
            let intersection = Polygon.intersect(this.edges[i], splitLine);
            if (intersection != null) {
                intersections.push(intersection);
                intersectedEdges.push(i); 
            }
        }

        // if there are no intersections, return the original polygon
        if (intersections.length == 0)
            return this;
        
        let halfPolygon = (start, finish) => {
            let vertexes = [intersections[start]]; // add first intersection
            let n = this.edges.length;
            for (let i = (intersectedEdges[start]+1)%n; i != intersectedEdges[finish]; i = (i+1)%n)
                vertexes.push(this.edges[i][0]);     
            vertexes = vertexes.concat([this.edges[intersectedEdges[finish]][0], intersections[finish]]); 
            return vertexes;
        }        

        return [new Polygon(halfPolygon(0, 1)), new Polygon(halfPolygon(1, 0))]
    }

    /* FUNCTION: checks if a given polygon contains a given point
     * ARGS: 
     *      point: p5.Vector - a point to be checked
     * RETURNS:
     *      bool: true if point is inside the polygon,
     *            false otherwise
     */
    contains(point) {
        let cnt = 0;
        for (let i = 0; i < this.edges.length; i++) {
            let [a, b] = this.edges[i];
            if (a.y == b.y) continue;
            let x = (point.y - a.y)/(b.y - a.y) * (b.x - a.x) + a.x;
            if (a.y >= point.y && point.y > b.y && x > point.x) cnt++;
            if (b.y >= point.y && point.y > a.y && x > point.x) cnt++;
        }
        return cnt % 2 == 1;
    }

    /* FUNCTION: draws a polygon (filled or unfilled depending on the filled property)*/
    draw() {
        fill(this.filled ? 0 : 255);
        beginShape();
        for (let edge of this.edges) {
            let [a, b] = edge;
            vertex(a.x, a.y);   
            vertex(b.x, b.y);
        }
        endShape(CLOSE);
    }
}