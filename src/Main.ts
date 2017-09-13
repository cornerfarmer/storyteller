

import {Writer} from "./Writer";
import {Teller} from "./Teller";
import {Phrase} from "./Phrase";
import {Word} from "./Word";
import {DialogTransition} from "./DialogTransition";
import {Story} from "./Story";
import {Character} from "./Character";

export class Main {
    private fps = 60;
    private writer : Writer;
    private teller : Teller;
    private story: Story;

    constructor() {
        this.story = new Story();
        this.writer = new Writer(this.story);
        this.teller = new Teller();

        let character = new Character("Gulliver");
        this.story.addActor(character);
        var phrase = new Phrase();

        let word = new Word("Bringt");
        word.font_size = 40;
        phrase.addWord(word);

        word = new Word("ihn");
        word.font_size = 20;
        phrase.addWord(word);

        word = new Word("weg!");
        word.font_size = 20;
        phrase.addWord(word);
        this.teller.addTransition(new DialogTransition(phrase));
        character.addActivePhrase(phrase);

        var that = this;
        setInterval(function () {
                that.gameLoop();
            }, 1000 / this.fps
        );
    }

    gameLoop() {
        this.teller.tell(1.0 / this.fps);
        this.writer.write();
    }

}

var main;

window.onload = function () {
    main = new Main();
};