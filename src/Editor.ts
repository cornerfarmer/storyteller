/// <reference path="../node_modules/@types/jquery/index.d.ts" />
import * as $ from "jquery";
import {Character} from "./Character";
import {Actor} from "./Actor";
import {DialogTransition} from "./DialogTransition";
import {Phrase} from "./Phrase";
import {Teller} from "./Teller";
import {Word} from "./Word";

export class Editor {
    private $selection;
    private teller: Teller;
    private selectedPhrase: Phrase;
    private nextInputIsNewWord: boolean;

    constructor(teller: Teller) {
        this.teller = teller;
        this.$selection = $("#editor #selection");
        this.selectedPhrase = null;
    }

    selectActor(actor: Actor) {
        if (actor instanceof Character)
            this.selectCharacter(actor);
    }

    selectCharacter(character: Character) {
        this.$selection.empty();
        this.$selection.append("<h2>" + character.name + "</h2>");
        this.$selection.append("<h3>Dialogs</h3>");
        this.$selection.append("<button id=\"add-dialog-button\">Add dialog</button>");
        let that = this;
        $("#editor #add-dialog-button").click(function() {
            that.addDialogToCharacter(character);
        });
    }

    addDialogToCharacter(character: Character) {
        this.selectedPhrase = new Phrase();
        character.addTransition(new DialogTransition(this.selectedPhrase, this.teller));
        character.setActivePhrase(this.selectedPhrase);
        this.nextInputIsNewWord = true;
    }


    enterText(text: string) {
        if (this.selectedPhrase !== null) {
            if (text === " ") {
                this.nextInputIsNewWord = true;
                return;
            }

            if (this.nextInputIsNewWord) {
                this.selectedPhrase.words.push(new Word(""));
                this.nextInputIsNewWord = false;
            }
            let word = this.selectedPhrase.words[this.selectedPhrase.words.length - 1];
            word.text += text;
            word.time = word.getTotalTime();
            this.selectedPhrase.recalculatePositions();
        }
    }
}