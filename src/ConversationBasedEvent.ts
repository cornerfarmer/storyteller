
import {Action} from "./Action";
import {Event} from "./Event";
import {Transition} from "./Transition";
import {Actor} from "./Actor";

export enum ConversationBasedEventType  {
    OnTalk
}

export class ConversationBasedEvent extends Event {
    public type: ConversationBasedEventType;
    public static intents: Array<string> = ["smalltalk.greetings.hello"];
    public intent: string;

    constructor(type: ConversationBasedEventType, action: Action, intent: string) {
        super(action);
        this.type = type;
        this.intent = intent;
    }

}