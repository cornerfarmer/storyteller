
import {Transition} from "./Transition";
import {Action} from "./Action";
import {TransitionBasedEvent, TransitionBasedEventType} from "./TransitionBasedEvent";
import {SceneBasedEvent, SceneBasedEventType} from "./SceneBasedEvent";
import {Story} from "./Story";
import {Actor} from "./Actor";
import {ConversationBasedEvent, ConversationBasedEventType} from "./ConversationBasedEvent";

export class Teller {
    private activeTransitions : Array<Transition>;
    private registeredActions : Array<Action>;
    private story: Story;

    constructor() {
        this.activeTransitions = [];
        this.registeredActions = [];
    }

    setStory(story: Story) {
        this.story = story;
    }

    addTransition(transition: Transition) {
        this.activeTransitions.push(transition);
    }

    raiseSceneBasedEvent(type: SceneBasedEventType) {
        for (let actor of this.story.actors) {
             for (let state of actor.activeStates) {
                  for (let event of state.events) {
                      if (event instanceof SceneBasedEvent && event.type === type)
                          this.registeredActions.push(event.action);
                  }
             }
        }
    }

    raiseTransitionBasedEvent(type: TransitionBasedEventType, transition: Transition) {
        for (let state of transition.actor.activeStates) {
            for (let event of state.events) {
                if (event instanceof TransitionBasedEvent && event.type === type && event.transition === transition) {
                    this.registeredActions.push(event.action);
                }
            }
        }
    }

    raiseConversationBasedEvent(type: ConversationBasedEventType, partner: Actor, intent: String) {
        for (let state of partner.activeStates) {
            for (let event of state.events) {
                if (event instanceof ConversationBasedEvent && event.type === type && event.intent === intent) {
                    this.registeredActions.push(event.action);
                }
            }
        }
    }

    tell(dt : number) {
        for (let i = 0; i < this.activeTransitions.length; i++) {
            let finished = this.activeTransitions[i].proceed(dt);
            if (finished)
                this.activeTransitions.splice(i--, 1);
        }

        for (let i = 0; i < this.registeredActions.length; i++) {
            let finished = this.registeredActions[i].execute(dt);
            if (finished)
                this.registeredActions.splice(i--, 1);
        }
    }
}