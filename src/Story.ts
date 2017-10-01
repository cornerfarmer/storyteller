import {Actor} from "./Actor";
import {Scene} from "./Scene";
import {Teller} from "./Teller";

export class Story {
    actors: Array<Actor>;
    scenes: Array<Scene>;
    initialScene: Scene;

    constructor(teller: Teller) {
        this.actors = [];
        this.scenes = [new Scene("Default", teller)];
        this.initialScene = this.scenes[0];
    }

    start() {
        for (let actor of this.actors)
            actor.reset();
        this.initialScene.start();
    }

    getActors(): Array<Actor> {
        return this.actors;
    }

    write(context) {
        for (let actor of this.actors)
            actor.write(context);
    }

    addActor(actor: Actor) {
        this.actors.push(actor);
    }
}