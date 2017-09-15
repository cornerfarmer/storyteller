import {Rect} from "./Rect";
import {Phrase} from "./Phrase";
import {Vector} from "./Vector";
import {AbstractTransition} from "./AbstractTransition";

export abstract class Actor {
    public name: string;
    private activePhrase: Phrase;
    public position: Vector;
    private width: number;
    private fontSize;
    private padding: Vector;
    private _transitions: Array<AbstractTransition>;

    constructor(name: string, position: Vector) {
        this.name = name;
        this.activePhrase = null;
        this.position = position;
        this.width = null;
        this.fontSize = 20;
        this.padding = new Vector(10, 5);
        this._transitions = [];
    }

    addTransition(transition: AbstractTransition) {
        this._transitions.push(transition);
    }

    get transitions(): Array<AbstractTransition> {
        return this._transitions;
    }

    setActivePhrase(phrase: Phrase) {
        this.activePhrase = phrase;
    }

    write(context) {
        this.writeSelf(context);

        if (this.activePhrase !== null)
            this.activePhrase.write(context, this.position.add(new Vector(100, -100)));
    }

    getRect(): Rect {
        return new Rect(this.position.x - this.width / 2 - this.padding.x, this.position.y - this.fontSize / 2 - this.padding.y, this.width + 2 * this.padding.x, this.fontSize + 2 * this.padding.y);
    }

    protected writeSelf(context) {
        context.textBaseline="middle";
        context.font = this.fontSize + "px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";

        if (this.width == null)
            this.width = context.measureText(this.name).width;

        let rect = this.getRect();
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
        context.fillStyle = "white";
        context.fillText(this.name, this.position.x, this.position.y);
    }
}