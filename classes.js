const SCALAR = 50;

class Logo {

    /**
     * FUNCTION: constructs a Logo object
     * ARGS: 
     *      word: string - a word to be displayed
     */
    constructor(word) {
        this.word = word;
        this.width = textWidth(word) * SCALAR; // TODO
        this.height = (textAscent(word) + textDescent(word)) * SCALAR; // TODO
        this.polygons = [new Polygon(
            createVector(0, 0),
            createVector(this.width, 0),
            createVector(this.width, this.height),
            createVector(0, this.height)
        )];
        this.graphics = createGraphics(this.width, this.height);
        this.graphics.text(word, 0, 0);
    }

    /* FUNCTION: initializes the polygons data structure
     * ARGS: 
     *      n: int - number of lines to split the logo with
     */
    addLines(n) {
        let result = [];
        for (let i = 0; i < n; i++) {
            let a = createVector(random(this.width), random(this.height));
            let b = createVector(random(this.width), random(this.height));
            result.concat(this.polygons.split(a, b));
        }
        this.polygons = result;
    }

    /* FUNCTION: draws all polygons on a p5 canvas */
    draw() {
        for (let polygon of this.polygons)
            polygon.draw();            
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
            let intersection = intersect(this.edges[i], splitLine);
            if (intersection !== null) {
                intersections.push(intersection);
                intersectedEdges.push(i); 
            }
        }

        if (intersections.length == 0)
            return this;
        
        let halfPolygon = (start, finish) => {
            let vertexes = [intersections[start]]; // add first intersection
            for (let i = intersectedEdges[start]+1; i != intersectedEdges[finish]; i = (i+1)%this.edges.length)
                vertexes.push(this.edges[i][0]);     
            vertexes.concat([this.edge[intersectedEdge[finish]][0], intersections[finish]]); 
            return vertexes;
        }        

        return [Polygon(halfPolygon(0, 1)), Polygon(halfPolygon(1, 0))]
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
            if (a.y >= p.y && p.y > b.y && x > p.x) cnt++;
            if (b.y >= p.y && p.y > a.y && x > p.x) cnt++;
        }
        return cnt % 2 == 1;
    }

    /* FUNCTION: draws a polygon (filled or unfilled depending on the filled property)*/
    draw() {
        fill(this.filled ? 0 : 255);
        beginShape();
        for (let edge of edges) {
            let [a, b] = edge;
            vertex(a.x, a.y);   
            vertex(b.x, b.y);
        }
        endShape();
    }
}