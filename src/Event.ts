
import {Action} from "./Action";


export abstract class Event {
    public action: Action;
    public type;

    constructor(action: Action) {
        this.action = action;
    }
}