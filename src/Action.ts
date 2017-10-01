
import {Transition} from "./Transition";
import {Teller} from "./Teller";
import {Character} from "./Character";
import {DialogTransition} from "./DialogTransition";

export class Action {
    public delay: number;
    public transition: Transition;
    public teller: Teller;
    public character: Character;

    constructor(delay: number, transition: Transition, teller: Teller, character: Character) {
        this.delay = delay;
        this.transition = transition;
        this.teller = teller;
        this.character = character;
    }

    execute(dt: number): boolean {
        this.delay -= dt;
        if (this.delay <= 0) {
            this.teller.addTransition(this.transition);
            if (this.transition instanceof DialogTransition)
                this.character.setActivePhrase(this.transition.phrase);
            return true;
        } else
            return false;
    }
}