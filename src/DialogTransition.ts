
import {AbstractTransition} from "./AbstractTransition";
import {Phrase} from "./Phrase";

export class DialogTransition extends AbstractTransition {
    private phrase: Phrase;

    constructor(phrase: Phrase) {
        super();
        this.phrase = phrase;
    }

    protected internProceed(dt: number): boolean {
        return this.phrase.proceed(dt);
    }

}