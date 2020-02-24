onmessage = message => {
    const polygons = message.data.polygons
    const filledPixels = message.data.filledPixels

    determineFilledPolygons({ polygons: polygons, filledPixels: filledPixels })

    postMessage({ polygons: polygons })
}

const determineFilledPolygons = ({ polygons, filledPixels }) => {
    filledPixels.forEach(pixel => {
        for (let polygon of polygons) {
            if (contains(polygon, pixel)) {
                polygon.filled = true;
                break;
            }
        }
    })
}

const contains = (polygon, point) => {
    let cnt = 0;
    polygon.edges.forEach(([a, b]) => {
        if (a.y == b.y) return;
        let x = (point.y - a.y) / (b.y - a.y) * (b.x - a.x) + a.x;
        if (a.y >= point.y && point.y > b.y && x > point.x) cnt++;
        if (b.y >= point.y && point.y > a.y && x > point.x) cnt++;
    })
    return cnt % 2 == 1;
}