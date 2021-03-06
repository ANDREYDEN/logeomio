class Polygon {
    /* FUNCTION: constructor
     * ARGS: 
     *      vertexes: Vector[] - points that define the polygon
     */
    constructor(vertexes) {
        this.edges = [];
        let n = vertexes.length;
        for (let i = 0; i < n; i++) {
            this.edges.push([vertexes[i], vertexes[(i + 1) % n]]);
        }
        this.filled = false;
    }

    /* FUNCTION: finds segment-line intersection
     * ARGS: 
     *      segment, line: [Vector, Vector] - points that define the segment and the line
     * RETURNS:
     *      Vector - coordinates of the intersection, or null if there is no intersection
     */
    static intersect(edge, line) {
        let [x1, y1] = [edge[0].x, edge[0].y];
        let [x2, y2] = [edge[1].x, edge[1].y];
        let [x3, y3] = [line[0].x, line[0].y];
        let [x4, y4] = [line[1].x, line[1].y];
        let x = 0;
        if (abs(x3 - x4) < EPS)
            x = x3;
        else
            x = ((x1 - x2) * (x3 * y4 - x4 * y3) + (x3 - x4) * (x2 * y1 - x1 * y2)) /
                ((y1 - y2) * (x3 - x4) - (y3 - y4) * (x1 - x2));
        let y = (x - x3) * (y3 - y4) / (x3 - x4) + y3;
        if (((x - x1 > -EPS && x2 - x > -EPS) || (x1 - x > -EPS && x - x2 > -EPS)) &&
            ((y - y1 > -EPS && y2 - y > -EPS) || (y1 - y > -EPS && y - y2 > -EPS)))
            return new Vector(x, y);
    }

    /* FUNCTION: returns the length of the edge */
    static edgeLen(edge) {
        return edge[0].dist(edge[1])
    }

    /* FUNCTION: returns the area of the polygon
    * RETURNS:
    *      float - the area of the polygon
    */
    area() {
        let singleArea = (A, B) => 0.5 * (A.x - B.x) * (A.y + B.y)
        return this.edges.reduce((sum, edge) => sum + singleArea(edge[0], edge[1]), 0)
    }

    /* FUNCTION: returns the perimeter of the polygon
    * RETURNS:
    *      float - the perimeter of the polygon
    */
    perimeter() {
        return this.edges.reduce((sum, edge) => sum + edge[0].dist(edge[1]), 0)
    }

    /* FUNCTION: finds the points of intersection if any by a given line
     * ARGS: 
     *      a, b: Vectors - points that define a splitting line
     * RETURNS:
     *      [[Vector, Vector], [int, int]] - points of intersection and the respetive edge numbers
     */
    intersectByLine(a, b) {
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
        return [intersections, intersectedEdges];
    }

    /* FUNCTION: splits the polygon given the points of splitting
    * ARGS:
    *      intersections: [Vector, Vector] - points (0 or 2) to split the polygon by
    *      intersectedEdges: [int, int] - numbers (0 or 2) of the lines that contain the intersections
    * RETURNS:
    *      Polygon[]: array of polygons as a result of splitting,
    *                 either one (same) polygon if not affected,
    *                 or two new polygons
    */
    split(intersections, intersectedEdges) {
        // if there are no intersections, return the original polygon
        if (intersections.length == 0) return this;

        let halfPolygon = (start, finish) => {
            let vertexes = [intersections[start]]; // add first intersection
            let n = this.edges.length;
            for (let i = (intersectedEdges[start] + 1) % n; i != intersectedEdges[finish]; i = (i + 1) % n) {
                vertexes.push(this.edges[i][0]);
            }
            return vertexes.concat([this.edges[intersectedEdges[finish]][0], intersections[finish]]);
        }

        return [new Polygon(halfPolygon(0, 1)), new Polygon(halfPolygon(1, 0))]
    }

    /* FUNCTION: checks if a given polygon contains a given point
     * ARGS: 
     *      point: Vector - a point to be checked
     * RETURNS:
     *      bool: true if point is inside the polygon,
     *            false otherwise
     */
    static contains(polygon, point) {
        let cnt = 0;
        polygon.edges.forEach(edge => {
            let [a, b] = edge
            if (a.y == b.y) return;
            let x = (point.y - a.y) / (b.y - a.y) * (b.x - a.x) + a.x;
            if (a.y >= point.y && point.y > b.y && x > point.x) cnt++;
            if (b.y >= point.y && point.y > a.y && x > point.x) cnt++;
        })
        return cnt % 2 == 1;
    }

    /* FUNCTION: pick a random point on the given edge
     * ARGS: 
     *      edgeNum: int - the number of the edge to pick the point on
     * RETURNS:
     *      Vector:  the resulting point
     */
    pickPoint(edgeNum) {
        // print(this.edges, edgeNum);
        let [a, b] = this.edges[edgeNum]
        let [x1, y1] = a.toArray()
        let [x2, y2] = b.toArray()
        if (abs(x1 - x2) < EPS) {
            return new Vector(x1, random(min(y1, y2), max(y1, y2)));
        }
        let x = random(min(x1, x2), max(x1, x2));
        let y = (x - x1) * (y1 - y2) / (x1 - x2) + y1;
        return new Vector(x, y);
    }

    /* FUNCTION: draws a polygon (filled or unfilled depending on the filled property)*/
    draw() {
        fill(this.filled ? 0 : 255)
        strokeWeight(0.05);

        beginShape()
        this.edges.forEach(edge => {
            let [a, b] = edge
            vertex(a.x, a.y)
            vertex(b.x, b.y)
        })
        endShape(CLOSE);
    }
}