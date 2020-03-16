class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    dist(otherVector) {
        const dtX = this.x - otherVector.x
        const dtY = this.y - otherVector.y
        return Math.sqrt(dtX * dtX + dtY * dtY)
    }

    toArray() {
        return [this.x, this.y]
    }
}