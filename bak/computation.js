self.addEventListener("message", message => {
    let [pixels, polygons, width, height, RED] = Object.values(message.data)
    
    let filledPixels = []
    // console.log(pixels.filter(val => val != 0))
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
            if (pixels[(x + y * width) * 4] == RED &&
                pixels[(x + y * width) * 4 + 1] == 0) {
                // for (let p of polygons)
                //     if (p.contains(createVector(x, y))) {
                //         p.filled = true;
                //         break;
                //     }
                filledPixels.push([x, y])
            }

    console.log(filledPixels)
    filledPixels.forEach(([x, y]) => {
        for (let p of polygons) {
            if (p.contains(createVector(x, y))) {
                p.filled = true;
                break;
            }
        }
    })

    self.postMessage({exit: 0, polygons: polygons})
})