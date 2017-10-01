
import {Teller} from "./Teller";
import {Actor} from "./Actor";
import {ConversationBasedEventType} from "./ConversationBasedEvent";
import {AI} from "./AI";

export class Player {
    private inputText: string;
    public talkPartner: Actor;
    private teller: Teller;
    private ai: AI;

    constructor(teller: Teller) {
        this.inputText = "";
        this.teller = teller;
        this.ai = new AI();
    }

    enterText(input: string) {
        if (this.talkPartner !== null) {
            if (input === "\n") {
                if (this.inputText.length > 0) {
                    let that = this;
                    this.ai.findIntend(this.inputText, function(result: string) {
                        that.talk(result);
                    });
                }
                this.inputText = "";
            } else {
                this.inputText += input;
            }
        }
    }

    talk(intend: string) {
         this.teller.raiseConversationBasedEvent(ConversationBasedEventType.OnTalk, this.talkPartner, intend);
    }

    removeLastChar() {
        if (this.inputText.length > 0) {
            this.inputText = this.inputText.substring(0, this.inputText.length - 1);
        }
    }

    startConversation(partner: Actor) {
        this.talkPartner = partner;
    }

    write(context) {
        context.font = "42px Georgia";
        context.textBaseline = "bottom";
        context.fillStyle = "black";
        context.textAlign = "center";

        context.fillText(this.inputText, 400, 600);
    }

}