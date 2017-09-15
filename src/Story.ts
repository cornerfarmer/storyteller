import {Actor} from "./Actor";

export class Story {
    actors: Array<Actor>;

    constructor() {
        this.actors = []
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