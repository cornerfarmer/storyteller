

import {Vector} from "./Vector";

export class KeyFrame {
    public position: Vector;
    public rotation: number;

    constructor(position: Vector, rotation: number) {
        this.position = position;
        this.rotation = rotation;
    }

    public clone(): KeyFrame {
        return new KeyFrame(this.position.clone(), this.rotation);
    }
}