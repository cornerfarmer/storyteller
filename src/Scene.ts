import {Character} from "./Character";
import {Teller} from "./Teller";
import {SceneBasedEventType} from "./SceneBasedEvent";

export class Scene {
    public characters: Array<Character>;
    public name: string;
    public teller: Teller;

    public constructor(name: string, teller: Teller) {
        this.name = name;
        this.characters = [];
        this.teller = teller;
    }

    public start() {
        this.teller.raiseSceneBasedEvent(SceneBasedEventType.OnSceneStarts)
    }
}