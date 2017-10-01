
import {Action} from "./Action";
import {Event} from "./Event";

export class State {
    public name: string;
    public events: Array<Event>;

    constructor(name: string) {
        this.name = name;
        this.events = [];
    }
}