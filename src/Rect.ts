
import {Vector} from "./Vector";

export class Rect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point: Vector) {
        return this.x < point.x && this.y < point.y && this.x + this.width > point.x && this.y + this.height > point.y;
    }
}