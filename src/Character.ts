import {Actor} from "./Actor";
import {Phrase} from "./Phrase";
import {Vector} from "./Vector";
import {Rect} from "./Rect";

export class Character extends Actor {

    constructor(name: string, position: Vector) {
        super(name, position);
    }
}