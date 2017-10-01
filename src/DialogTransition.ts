
import {Transition} from "./Transition";
import {Phrase} from "./Phrase";
import {Teller} from "./Teller";
import {Actor} from "./Actor";

export class DialogTransition extends Transition {
    public phrase: Phrase;

    constructor(phrase: Phrase, teller: Teller, actor: Actor) {
        super(teller, actor);
        this.phrase = phrase;
    }

    protected internProceed(dt: number): boolean {
        return this.phrase.proceed(dt);
    }

    public reset() {
        this.phrase.reset();
    }
}