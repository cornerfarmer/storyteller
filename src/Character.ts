import {Actor} from "./Actor";
import {Phrase} from "./Phrase";

export class Character extends Actor {
    private name: string;
    private activePhrase: Phrase;

    constructor(name: string) {
        super();
        this.name = name;
        this.activePhrase = null
    }

    setActivePhrase(phrase: Phrase) {
        this.activePhrase = phrase;
    }

    write(context) {
        if (this.activePhrase !== null)
            this.activePhrase.write(context);
    }
}