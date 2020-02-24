importScripts('polygon.js')

onmessage = message => {
    const polygons = message.data.polygons
    const filledPixels = message.data.filledPixels

    determineFilledPolygons({ polygons: polygons, filledPixels: filledPixels })

    postMessage({ polygons: polygons })
}

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