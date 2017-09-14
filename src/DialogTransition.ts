
import {AbstractTransition} from "./AbstractTransition";
import {Phrase} from "./Phrase";
import {Teller} from "./Teller";

export class DialogTransition extends AbstractTransition {
    public phrase: Phrase;

    constructor(phrase: Phrase, teller: Teller) {
        super(teller);
        this.phrase = phrase;
    }

    protected internProceed(dt: number): boolean {
        return this.phrase.proceed(dt);
    }

}