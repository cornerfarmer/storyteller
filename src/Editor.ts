/// <reference path="../node_modules/@types/jquery/index.d.ts" />
import * as $ from "jquery";
import {Character} from "./Character";
import {Actor} from "./Actor";
import {DialogTransition} from "./DialogTransition";
import {Phrase} from "./Phrase";
import {Teller} from "./Teller";
import {Word} from "./Word";
import {State} from "./State";
import {TransitionBasedEvent, TransitionBasedEventType} from "./TransitionBasedEvent";
import {Story} from "./Story";
import {Event} from "./Event";
import {Action} from "./Action";
import {SceneBasedEvent, SceneBasedEventType} from "./SceneBasedEvent";
import {ConversationBasedEvent, ConversationBasedEventType} from "./ConversationBasedEvent";
import {MovementTransition} from "./MovementTransition";
import {Vector} from "./Vector";
import {EditorPanelInterface} from "./EditorPanelInterface";
import {DialogsPanel} from "./DialogsPanel";
import {MovementsPanel} from "./MovementsPanel";
import {StatesPanel} from "./StatesPanel";
import {EventsPanel} from "./EventsPanel";


export class Editor {
    private $inspectorEvents;
    public selectedActor: Actor;
    private teller: Teller;
    private story: Story;
    private selectedPhrase: Phrase;
    public isActive: boolean;
    private panels: Array<EditorPanelInterface>;

    constructor(teller: Teller, story: Story) {
        this.teller = teller;
        this.story = story;
        this.selectedPhrase = null;
        this.isActive = true;
        let statesPanel = new StatesPanel(this, this.teller, this.story);
        this.panels = [new DialogsPanel(this, this.teller, this.story), new MovementsPanel(this, this.teller, this.story), statesPanel, new EventsPanel(this, this.teller, this.story, statesPanel)];
    }


    selectActor(actor: Actor) {
        if (actor instanceof Character)
            this.selectCharacter(actor);
    }

    selectCharacter(character: Character) {
        this.selectedActor = character;
        this.refreshInspector();
    }

    refreshInspector() {
        for (let panel of this.panels) {
            panel.refresh();
        }
    }

    deselectAll() {
        for (let panel of this.panels) {
            panel.deselect();
        }
    }

    refreshDialogs() {
        /*this.$inspectorDialogs.append("<button id=\"play-button\">Play/Stop</button>");
        $("#editor #play-button").click(function () {
            that.story.start();
            that.isActive = false;
        });*/
    }

    createFormHtmlForEvent(event: Event) {

        let form = "<select class=\"type-select\">";
        for (let type in EventTypes) {
            if (isNaN(Number(type)))
                form += "<option value=\"" + EventTypes[type] + "\" " + (this.getTypeOfEvent(event) == EventTypes[type] ? "selected":"") + ">" + type + "</option>";
        }
        form += "</select>";

        form += "<select class=\"event-type-select\">";
        let eventTypes = this.getEventTypesForEvent(event);
        for (let eventType in eventTypes) {
            if (isNaN(Number(eventType)))
                form += "<option value=\"" + eventTypes[eventType] + "\" " + (event.type == eventTypes[eventType] ? "selected":"") + ">" + eventType + "</option>";
        }
        form += "</select>";

        if (event instanceof TransitionBasedEvent) {
            form += "<select class=\"actor-select\">";
            for (let actorId in this.story.actors)
                form += "<option value=\"" + actorId + "\" " + (event.actor === this.story.actors[actorId] ? "selected":"") + ">" + this.story.actors[actorId].name + "</option>";
            form += "</select>";

            form += "<select class=\"transition-select\">";
            for (let transitionId in event.actor.transitions)
                form += "<option value=\"" + transitionId + "\" " + (event.transition === event.actor.transitions[transitionId] ? "selected":"") + ">" + event.actor.transitions[transitionId].getLabel() + "</option>";
            form += "</select>";
        } else if (event instanceof ConversationBasedEvent) {
            form += "<select class=\"intent-select\">";
            for (let intent of ConversationBasedEvent.intents)
                form += "<option value=\"" + intent + "\" " + (event.intent === intent ? "selected":"") + ">" + intent + "</option>";
            form += "</select>";
        }

        form += "<select class=\"action-transition-select\">";
        for (let transitionId in this.selectedActor.transitions)
            form += "<option value=\"" + transitionId + "\" " + (event.action.transition === this.selectedActor.transitions[transitionId] ? "selected":"") + ">" + this.selectedActor.transitions[transitionId].getLabel() + "</option>";
        form += "</select>";

        return form;
    }

    registerListenerForEventForm(event: Event, index: number) {
        let that = this;

        $("#event-" + index + " .type-select").change(function () {
            if ($(this).val() == EventTypes.Scene)
                that.selectedState.events[index] = new SceneBasedEvent(SceneBasedEventType.OnSceneStarts, that.selectedState.events[index].action);
            else if ($(this).val() == EventTypes.Transition)
                that.selectedState.events[index] = new TransitionBasedEvent(TransitionBasedEventType.OnTransitionEnds, that.selectedState.events[index].action, that.selectedActor, that.selectedActor.transitions[0]);
            else if ($(this).val() == EventTypes.Conversation)
                that.selectedState.events[index] = new ConversationBasedEvent(ConversationBasedEventType.OnTalk, that.selectedState.events[index].action, ConversationBasedEvent.intents[0]);
            that.refreshEvents();
        });

        $("#event-" + index + " .event-type-select").change(function () {
            event.type = $(this).val();
        });

        if (event instanceof TransitionBasedEvent) {
            $("#event-" + index + " .actor-select").change(function () {
                event.actor = that.story.actors[$(this).val()];
                that.refreshEvents();
            });

            $("#event-" + index + " .transition-select").change(function () {
                event.transition = event.actor.transitions[$(this).val()];
            });
        } else if (event instanceof ConversationBasedEvent) {
            $("#event-" + index + " .intent-select").change(function () {
                event.intent = $(this).val();
            });
        }

        $("#event-" + index + " .action-transition-select").change(function () {
            event.action.transition = that.selectedActor.transitions[$(this).val()];
        });
    }

    refreshEvents() {
        if (this.selectedActor instanceof Character) {
            this.$inspectorEvents.empty();
            this.$inspectorEvents.append("<h3>Events</h3>");

            let i = 0;
            for (let event of this.selectedState.events) {
                let form = "<div id=\"event-" + i + "\">";

                form += this.createFormHtmlForEvent(event);

                form += "</div>";

                this.$inspectorEvents.append(form);

                this.registerListenerForEventForm(event, i);

                i++;
            }
        }
    }

    addEvent() {
        if (this.selectedActor.transitions.length > 0) {
            let action = new Action(0, this.selectedActor.transitions[0], this.teller, this.selectedActor);
            this.selectedState.events.push(new TransitionBasedEvent(TransitionBasedEventType.OnTransitionEnds, action, this.selectedActor, this.selectedActor.transitions[0]));
            this.refreshEvents();
        }
    }

    enterText(text: string) {
        for (let panel of this.panels) {
            panel.enterText(text);
        }
    }

    removeLastChar() {
        for (let panel of this.panels) {
            panel.removeLastChar();
        }
    }

    write(context) {
        for (let panel of this.panels) {
            panel.write(context);
        }
    }

    onMouseUp(pos: Vector) {
        for (let actor of this.story.actors) {
            if (actor.getRect().contains(pos))
                this.selectActor(actor);
        }
        for (let panel of this.panels) {
            panel.onMouseUp(pos);
        }
    }

    onMouseDown(pos: Vector) {
        for (let panel of this.panels) {
            panel.onMouseDown(pos);
        }
    }

    onMouseMove(pos: Vector) {
        for (let panel of this.panels) {
            panel.onMouseMove(pos);
        }
    }
}