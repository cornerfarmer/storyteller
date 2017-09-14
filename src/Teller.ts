
import {AbstractTransition} from "./AbstractTransition";
import {Action} from "./Action";

export class Teller {
    private activeTransitions : Array<AbstractTransition>;
    private registeredActions : Array<Action>;

    constructor() {
        this.activeTransitions = [];
        this.registeredActions = [];
    }

    addTransition(transition: AbstractTransition) {
        this.activeTransitions.push(transition);
    }

    registerAction(action: Action) {
        this.registeredActions.push(action);
    }

    tell(dt : number) {
        for (let i = 0; i < this.activeTransitions.length; i++) {
            let finished = this.activeTransitions[i].proceed(dt);
            if (finished)
                this.activeTransitions.splice(i--, 1);
        }

        for (let i = 0; i < this.registeredActions.length; i++) {
            let finished = this.registeredActions[i].execute(dt);
            if (finished)
                this.registeredActions.splice(i--, 1);
        }
    }
}