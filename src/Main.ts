

import {Writer} from "./Writer";
import {Teller} from "./Teller";
import {Phrase} from "./Phrase";
import {Word} from "./Word";
import {DialogTransition} from "./DialogTransition";
import {Story} from "./Story";
import {Character} from "./Character";
import {Action} from "./Action";

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
        phrase.addWord(word);

        word = new Word("weg!");
        phrase.addWord(word);

        let transition = new DialogTransition(phrase, this.teller);
        this.teller.addTransition(transition);
        character.setActivePhrase(phrase);

        phrase = new Phrase();
        word = new Word("Wehe");
        word.font_size = 40;
        phrase.addWord(word);

        phrase.addWord(new Word("euch", true));
        phrase.addWord(new Word("ich"));
        phrase.addWord(new Word("seh"));
        phrase.addWord(new Word("den", true));
        phrase.addWord(new Word("hier"));
        phrase.addWord(new Word("nochmal!", false, 30));

        transition.addActionAfterEnd(new Action(1, new DialogTransition(phrase, this.teller), this.teller, character));

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