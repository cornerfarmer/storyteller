export class Vector {
    public x: number;
    public y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(otherVector: Vector): Vector {
        return new Vector(this.x + otherVector.x, this.y + otherVector.y);
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }
}