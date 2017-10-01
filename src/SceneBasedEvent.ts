
import {Action} from "./Action";
import {Event} from "./Event";
import {Transition} from "./Transition";

export enum SceneBasedEventType  {
    OnSceneStarts
}

export class SceneBasedEvent extends Event {
    public type: SceneBasedEventType;

    constructor(type: SceneBasedEventType, action: Action) {
        super(action);
        this.type = type;
    }

}