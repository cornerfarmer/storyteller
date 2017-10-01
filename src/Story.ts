import {Actor} from "./Actor";
import {Scene} from "./Scene";
import {Teller} from "./Teller";
import {Player} from "./Player";

export class Story {
    actors: Array<Actor>;
    scenes: Array<Scene>;
    initialScene: Scene;
    player: Player;

    constructor(teller: Teller) {
        this.player = new Player(teller);
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
        this.player.write(context);
    }

    addActor(actor: Actor) {
        this.actors.push(actor);
    }
}