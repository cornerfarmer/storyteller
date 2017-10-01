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

enum EventTypes {
    Transition,
    Scene,
    Conversation
}

export class Editor {
    private $inspectorDialogs;
    private $inspectorStates;
    private $inspectorEvents;
    private selectedActor: Actor;
    private selectedState: State;
    private teller: Teller;
    private story: Story;
    private selectedPhrase: Phrase;
    private nextInputIsNewWord: boolean;
    public isActive: boolean;

    constructor(teller: Teller, story: Story) {
        this.teller = teller;
        this.story = story;
        this.initialize();
        this.selectedPhrase = null;
        this.isActive = true;
    }

    initialize() {
        this.$inspectorDialogs = $("#editor #inspector #dialogs");
        this.$inspectorStates = $("#editor #inspector #states");
        this.$inspectorEvents = $("#editor #inspector #events");
        let that = this;
        $("#editor #inspector #add-event").click(function () {
            that.addEvent()
        });
    }

    selectActor(actor: Actor) {
        if (actor instanceof Character)
            this.selectCharacter(actor);
    }

    selectCharacter(character: Character) {
        this.selectedActor = character;
        this.selectedState = character.states[0];
        this.refreshInspector();
    }

    selectState(state: State) {
        this.selectedState = state;
        this.refreshEvents();
    }

    refreshInspector() {
        this.refreshDialogs();
        this.refreshStates();
        this.refreshEvents();
    }

    refreshDialogs() {
        if (this.selectedActor instanceof Character) {
            this.$inspectorDialogs.empty();
            this.$inspectorDialogs.append("<h2>" + this.selectedActor.name + "</h2>");
            this.$inspectorDialogs.append("<h3>Dialogs</h3>");
            for (let transition of this.selectedActor.transitions) {
                if (transition instanceof DialogTransition) {
                    let dialog = "<div class=\"dialog\">";
                    dialog += "<div class=\"title\">" + transition.phrase.getTotalText() + "</div>";

                    //dialog += "<div class=\"add-action\"><button class=\"add-action-button\">Add action</button></div>";
                    //dialog += "</div>";
                    dialog += "</div>";

                    this.$inspectorDialogs.append(dialog);
                }
            }
            this.$inspectorDialogs.append("<button id=\"add-dialog-button\">Add dialog</button>");
            let that = this;
            $("#editor #add-dialog-button").click(function () {
                that.addDialogToCharacter(that.selectedActor);
                $(this).blur();
            });

            this.$inspectorDialogs.append("<button id=\"play-button\">Play/Stop</button>");
            $("#editor #play-button").click(function () {
                that.story.start();
                that.isActive = false;
            });
        }
    }

    refreshStates() {
        if (this.selectedActor instanceof Character) {
            this.$inspectorStates.empty();
            this.$inspectorStates.append("<h3>States</h3>");
            let that = this;
            for (let state of this.selectedActor.states) {
                $("<div>" + state.name + "</div>").appendTo(this.$inspectorStates).click(function () {
                    that.selectState(state);
                });
            }
        }
    }

    getTypeOfEvent(event: Event) {
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
                form += "<option value=\"" + transitionId + "\" " + (event.transition === event.actor.transitions[transitionId] ? "selected":"") + ">" + event.actor.transitions[transitionId].phrase.getTotalText() + "</option>";
            form += "</select>";
        } else if (event instanceof ConversationBasedEvent) {
            form += "<select class=\"intent-select\">";
            for (let intent of ConversationBasedEvent.intents)
                form += "<option value=\"" + intent + "\" " + (event.intent === intent ? "selected":"") + ">" + intent + "</option>";
            form += "</select>";
        }

        form += "<select class=\"action-transition-select\">";
        for (let transitionId in this.selectedActor.transitions)
            form += "<option value=\"" + transitionId + "\" " + (event.action.transition === this.selectedActor.transitions[transitionId] ? "selected":"") + ">" + this.selectedActor.transitions[transitionId].phrase.getTotalText() + "</option>";
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

    addDialogToCharacter(character: Character) {
        this.selectedPhrase = new Phrase();
        character.addTransition(new DialogTransition(this.selectedPhrase, this.teller, character));
        character.setActivePhrase(this.selectedPhrase);
        this.nextInputIsNewWord = true;
    }

    addEvent() {
        if (this.selectedActor.transitions.length > 0) {
            let action = new Action(0, this.selectedActor.transitions[0], this.teller, this.selectedActor);
            this.selectedState.events.push(new TransitionBasedEvent(TransitionBasedEventType.OnTransitionEnds, action, this.selectedActor, this.selectedActor.transitions[0]));
            this.refreshEvents();
        }
    }

    enterText(text: string) {
        if (this.selectedPhrase !== null) {
            if (text === " ") {
                this.nextInputIsNewWord = true;
            } else if (text === "\n") {
                this.nextInputIsNewWord = true;
                if (this.selectedPhrase.words.length > 0)
                    this.selectedPhrase.words[this.selectedPhrase.words.length - 1].newLineAfterwards = true;
            } else {
                if (this.nextInputIsNewWord) {
                    this.selectedPhrase.words.push(new Word(""));
                    this.nextInputIsNewWord = false;
                }
                let word = this.selectedPhrase.words[this.selectedPhrase.words.length - 1];
                word.text += text;
                word.time = word.getTotalTime();
                this.selectedPhrase.recalculatePositions();
                this.refreshInspector();
            }
        }
    }

    removeLastChar() {
        if (this.selectedPhrase.words.length > 0) {
            let word = this.selectedPhrase.words[this.selectedPhrase.words.length - 1];
            if (word.text.length > 1 || (word.text.length > 0 && this.selectedPhrase.words.length === 1))
                word.text = word.text.substring(0, word.text.length - 1);
            else if (this.selectedPhrase.words.length > 1)
                this.selectedPhrase.words.pop();
        }
    }
}