/// <reference path="../node_modules/@types/jquery/index.d.ts" />
import * as $ from "jquery";
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
import {SceneBasedEvent, SceneBasedEventType} from "./SceneBasedEvent";
import {ConversationBasedEvent, ConversationBasedEventType} from "./ConversationBasedEvent";
import {Story} from "./Story";

enum EventTypes {
    Transition,
    Scene,
    Conversation
}

export class EventsPanel extends EditorPanel<Event> {
    private statesPanel: StatesPanel;

    constructor(editor: Editor, teller: Teller, story: Story, statesPanel: StatesPanel) {
        super("events", editor, teller, story);
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

    protected addElementToElements(element: Event) {
        this.statesPanel.selectedElement.events.push(element);
        return this.statesPanel.selectedElement.events.length - 1;
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


    getEventTypesForEvent(event: Event) {
        if (event instanceof TransitionBasedEvent)
            return TransitionBasedEventType;
        else if (event instanceof SceneBasedEvent)
            return SceneBasedEventType;
        else if (event instanceof ConversationBasedEvent)
            return ConversationBasedEventType;
    }

    protected addElementToolbar($panel, element: Event) {

        let form = "<select class=\"type-select\">";
        for (let type in EventTypes) {
            if (isNaN(Number(type)))
                form += "<option value=\"" + EventTypes[type] + "\" " + (this.getTypeOfEvent(element) == EventTypes[type] ? "selected":"") + ">" + type + "</option>";
        }
        form += "</select>";

        form += "<select class=\"event-type-select\">";
        let eventTypes = this.getEventTypesForEvent(element);
        for (let eventType in eventTypes) {
            if (isNaN(Number(eventType)))
                form += "<option value=\"" + eventTypes[eventType] + "\" " + (element.type == eventTypes[eventType] ? "selected":"") + ">" + eventType + "</option>";
        }
        form += "</select>";

        if (element instanceof TransitionBasedEvent) {
            form += "<select class=\"actor-select\">";
            for (let actorId in this.story.actors)
                form += "<option value=\"" + actorId + "\" " + (element.actor === this.story.actors[actorId] ? "selected":"") + ">" + this.story.actors[actorId].name + "</option>";
            form += "</select>";

            form += "<select class=\"transition-select\">";
            for (let transitionId in element.actor.transitions)
                form += "<option value=\"" + transitionId + "\" " + (element.transition === element.actor.transitions[transitionId] ? "selected":"") + ">" + element.actor.transitions[transitionId].getLabel() + "</option>";
            form += "</select>";
        } else if (element instanceof ConversationBasedEvent) {
            form += "<select class=\"intent-select\">";
            for (let intent of ConversationBasedEvent.intents)
                form += "<option value=\"" + intent + "\" " + (element.intent === intent ? "selected":"") + ">" + intent + "</option>";
            form += "</select>";
        }

        form += "<select class=\"action-transition-select\">";
        for (let transitionId in this.getSelectedActor().transitions)
            form += "<option value=\"" + transitionId + "\" " + (element.action.transition === this.getSelectedActor().transitions[transitionId] ? "selected":"") + ">" + this.getSelectedActor().transitions[transitionId].getLabel() + "</option>";
        form += "</select>";

        $panel.append(form);


        let that = this;

        $panel.find(".type-select").change(function () {
            if ($(this).val() == EventTypes.Scene)
                that.getElements()[that.selectedElementIndex] = new SceneBasedEvent(SceneBasedEventType.OnSceneStarts, that.selectedElement.action);
            else if ($(this).val() == EventTypes.Transition)
                that.getElements()[that.selectedElementIndex] = new TransitionBasedEvent(TransitionBasedEventType.OnTransitionEnds, that.selectedElement.action, that.getSelectedActor(), that.getSelectedActor().transitions[0]);
            else if ($(this).val() == EventTypes.Conversation)
                that.getElements()[that.selectedElementIndex] = new ConversationBasedEvent(ConversationBasedEventType.OnTalk, that.selectedElement.action, ConversationBasedEvent.intents[0]);
            that.selectedElement = that.getElements()[that.selectedElementIndex];
            that.refresh();
        });

        $panel.find(".event-type-select").change(function () {
            that.selectedElement.type = $(this).val();
        });

        if (that.selectedElement instanceof TransitionBasedEvent) {
            $panel.find(".actor-select").change(function () {
                that.selectedElement.actor = that.story.actors[$(this).val()];
                that.refresh();
            });

            $panel.find(".transition-select").change(function () {
                that.selectedElement.transition = that.selectedElement.actor.transitions[$(this).val()];
            });
        } else if (that.selectedElement instanceof ConversationBasedEvent) {
            $panel.find(".intent-select").change(function () {
                that.selectedElement.intent = $(this).val();
            });
        }

        $panel.find(".action-transition-select").change(function () {
            that.selectedElement.action.transition = that.getSelectedActor().transitions[$(this).val()];
        });
    }

}
