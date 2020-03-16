const importRes = importScripts('polygon.js')

onmessage = message => {
    const polygons = message.data.polygons
    const filledPixels = message.data.filledPixels

    determineFilledPolygons({ polygons: polygons, filledPixels: filledPixels })

    postMessage({ polygons: polygons })
}

/* FUNCTION: given the polygons and filled pixels determines which polygons should be filled
 * ARGS:
 *      polygons: Array<Object> - array of polygons to process
 *      filledPixels: Array<Object> - all the filled pixels in the image
 */
const determineFilledPolygons = ({ polygons, filledPixels }) => {
    filledPixels.forEach(pixel => {
        for (let polygon of polygons) {
            if (Polygon.contains(polygon, pixel)) {
                polygon.filled = true;
                break;
            }
        }
    })
}