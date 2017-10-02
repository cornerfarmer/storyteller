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

    mul(factor: number): Vector {
        return new Vector(this.x * factor, this.y * factor);
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }
}