
import {Transition} from "./Transition";
import {Action} from "./Action";
import {TransitionBasedEvent, TransitionBasedEventType} from "./TransitionBasedEvent";

export class Teller {
    private activeTransitions : Array<Transition>;
    private registeredActions : Array<Action>;

    constructor() {
        this.activeTransitions = [];
        this.registeredActions = [];
    }

    addTransition(transition: Transition) {
        this.activeTransitions.push(transition);
    }

    raiseTransitionBasedEvent(type: TransitionBasedEventType, transition: Transition) {
        for (let state of transition.actor.activeStates) {
            for (let event of state.events) {
                if (event instanceof TransitionBasedEvent && event.type === type && event.transition === transition) {
                    this.registeredActions.push(event.action);
                }
            }
        }
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