class Logo {
    constructor(word) {
        this.width = 0; // TODO
        this.height = 0; // TODO
        this.polygons = [new Polygon()];
        this.graphics = createGraphics(this.width, this.height);
    }

    /* FUNCTION: initializes the polygons data structure
     * ARGS: 
     *      n: int - number of lines to split the logo with
     */
    addLines(n) {
        let result = [];
        for (let i = 0; i < n; i++) {
            let a = p5.Vector.random2D();
            let b = p5.Vector.random2D();
            result.concat(this.polygons.split(a, b));
        }
    }

    /* FUNCTION: draws the polygon datastructure on a p5 canvas */
    draw() {
        for (let polygon of this.polygons)
            polygon.draw();            
    }
}

class Polygon {
    /* FUNCTION: constructor
     * ARGS: 
     *      vertexes: [x, y] - points that define the polygon
     */    
    constructor(vertexes) {
        
        this.edges = []; // TODO
        this.filled = false;
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

    }

    /* FUNCTION: checks if a given polygon contains a given point
     * ARGS: 
     *      point: p5.Vector - a point to be checked
     * RETURNS:
     *      bool: true if point is inside the polygon,
     *            false otherwise
     */
    contains(point) {

    }

    /* FUNCTION: draws a polygon (filled or unfilled depending on the filled property)*/
    draw() {
        if (this.filled)
            fill(0);
        else
            fill(255);
        beginShape();
        for (let edge of edges) {
            let [a, b] = edge;
            vertex(a.x, a.y);   
            vertex(b.x, b.y);
        }
        endShape();                                                                                                                                 
    }
}