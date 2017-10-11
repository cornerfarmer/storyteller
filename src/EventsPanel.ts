
import {EditorPanel} from "./EditorPanel";
import {DialogTransition} from "./DialogTransition";
import {Editor} from "./Editor";
import {Phrase} from "./Phrase";
import {Word} from "./Word";
import {Teller} from "./Teller";
import {State} from "./State";
import {Action} from "./Action";
import {TransitionBasedEvent, TransitionBasedEventType} from "./TransitionBasedEvent";
import {StatesPanel} from "./StatesPanel";
import {Event} from "./Event";
import {SceneBasedEvent} from "./SceneBasedEvent";
import {ConversationBasedEvent} from "./ConversationBasedEvent";

enum EventTypes {
    Transition,
    Scene,
    Conversation
}

export class EventsPanel extends EditorPanel<Event> {
    private statesPanel: StatesPanel;

    constructor(editor: Editor, teller: Teller, statesPanel: StatesPanel) {
        super("events", editor, teller);
        this.statesPanel = statesPanel;
    }

    protected createNewElement(): Event {
        if (this.getSelectedActor().transitions.length > 0) {
            let action = new Action(0, this.getSelectedActor().transitions[0], this.teller, this.getSelectedActor());
            return new TransitionBasedEvent(TransitionBasedEventType.OnTransitionEnds, action, this.getSelectedActor(), this.getSelectedActor().transitions[0]);
        } else {
            return null;
        }
    }

    protected saveElement(element: Event) {
        //element.name = this.getJQueryElement("name-input").val();
    }

    protected getElements(): Array<Event> {
        return this.statesPanel.selectedElement.events;
    }

    protected getLabelForElement(element: Event): string {
        let text = this.getTypeOfEvent(element) + " - " + element.type + " - ";
        if (element instanceof TransitionBasedEvent) {
            text += element.actor.name + " - ";
            text += element.transition.getLabel() + " - ";
        } else if (element instanceof ConversationBasedEvent) {
            text += element.intent + " - ";
        }
        text += element.action.transition.getLabel();
        return text;
    }

    private getTypeOfEvent(event: Event) {
        if (event instanceof TransitionBasedEvent)
            return EventTypes.Transition;
        else if (event instanceof SceneBasedEvent)
            return EventTypes.Scene;
        else if (event instanceof ConversationBasedEvent)
            return EventTypes.Conversation;
    }

    protected addElementToolbar($panel, element: Event) {
        /*let that = this;
        $panel.append("<input id=\"name-input\" value=\"" + (element == null ? "Name" : element.name) + "\">");
        $panel.append("<button id=\"add-point-button\">Add point</button>");
        $("#editor #add-point-button").click(function () {
            that.addPointToMovement();
            $(this).blur();
        });*/
    }

}