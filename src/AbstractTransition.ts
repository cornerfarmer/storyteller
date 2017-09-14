import {Action} from "./Action";
import {Teller} from "./Teller";

export abstract class AbstractTransition {
    private actionsAfterEnd: Array<Action>;
    private teller: Teller;

    constructor(teller: Teller) {
        this.actionsAfterEnd = [];
        this.teller = teller;
    }

    addActionAfterEnd(actionsAfterEnd: Action) {
        this.actionsAfterEnd.push(actionsAfterEnd);
    }

    proceed(dt : number): boolean {
        let finished = this.internProceed(dt);
        if (finished) {
            for (let action of this.actionsAfterEnd)
                this.teller.registerAction(action);
        }
        return finished;
    }

    protected abstract internProceed(dt: number): boolean;
}