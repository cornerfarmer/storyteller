import {Actor} from "./Actor";
import {Phrase} from "./Phrase";

export class Character extends Actor {
    private name: string;
    private activePhrases: Array<Phrase>;

    constructor(name: string) {
        super();
        this.name = name;
        this.activePhrases = []
    }

    addActivePhrase(phrase: Phrase) {
        this.activePhrases.push(phrase);
    }

    write(context) {
        for (let phrase of this.activePhrases)
            phrase.write(context);
    }
}