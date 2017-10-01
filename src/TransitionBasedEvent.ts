
import {Action} from "./Action";
import {Event} from "./Event";
import {Transition} from "./Transition";
import {Actor} from "./Actor";

export enum TransitionBasedEventType  {
    OnTransitionEnds
}

export class TransitionBasedEvent extends Event {
    public type: TransitionBasedEventType;
    public actor: Actor;
    public transition: Transition;

    constructor(type: TransitionBasedEventType, action: Action, actor: Actor, transition: Transition) {
        super(action);
        this.type = type;
        this.actor = actor;
        this.transition = transition;
    }

}