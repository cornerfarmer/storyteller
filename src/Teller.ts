
import {AbstractTransition} from "./AbstractTransition";

export class Teller {
    private activeTransitions : Array<AbstractTransition>;

    constructor() {
        this.activeTransitions = [];
    }

    addTransition(transition: AbstractTransition) {
        this.activeTransitions.push(transition);
    }

    tell(dt : number) {
        for (let i = 0; i < this.activeTransitions.length; i++) {
            let finished = this.activeTransitions[i].proceed(dt);
            if (finished)
                this.activeTransitions.splice(i--, 1);
        }
    }
}