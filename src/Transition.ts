import {Action} from "./Action";
import {Teller} from "./Teller";
import {Actor} from "./Actor";
import {TransitionBasedEventType} from "./TransitionBasedEvent";

export abstract class Transition {
    private teller: Teller;
    public actor: Actor;

    constructor(teller: Teller, actor: Actor) {
        this.teller = teller;
        this.actor = actor;
    }

    proceed(dt : number): boolean {
        let finished = this.internProceed(dt);
        if (finished) {
            this.teller.raiseTransitionBasedEvent(TransitionBasedEventType.OnTransitionEnds, this);
        }
        return finished;
    }

    protected abstract internProceed(dt: number): boolean;
    public abstract reset();
    public abstract getLabel(): string;
}