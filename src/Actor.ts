import {Rect} from "./Rect";
import {Phrase} from "./Phrase";
import {Vector} from "./Vector";
import {Transition} from "./Transition";
import {State} from "./State";

export abstract class Actor {
    public name: string;
    private activePhrase: Phrase;
    public position: Vector;
    public rotation: number;
    private width: number;
    private fontSize;
    private padding: Vector;
    private _transitions: Array<Transition>;
    public states: Array<State>;
    public activeStates: Array<State>;

    constructor(name: string, position: Vector) {
        this.name = name;
        this.activePhrase = null;
        this.position = position;
        this.rotation = 0;
        this.width = null;
        this.fontSize = 20;
        this.padding = new Vector(10, 5);
        this._transitions = [];
        this.states = [new State("Default")];
        this.reset();
    }

    reset() {
        this.activeStates = [this.states[0]];
        for (let transition of this._transitions)
            transition.reset();
    }

    addTransition(transition: Transition) {
        this._transitions.push(transition);
    }

    get transitions(): Array<Transition> {
        return this._transitions;
    }

    setActivePhrase(phrase: Phrase) {
        if (this.activePhrase !== null)
            this.activePhrase.reset();
        this.activePhrase = phrase;
    }

    write(context) {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);
        this.writeSelf(context);

        if (this.activePhrase !== null)
            this.activePhrase.write(context, new Vector(100, -100));
        context.restore();
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
        context.fillRect(rect.x - this.position.x, rect.y - this.position.y, rect.width, rect.height);
        context.fillStyle = "white";
        context.fillText(this.name, 0, 0);
    }
}