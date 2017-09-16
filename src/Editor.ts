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
        for (let transition of character.transitions) {
            if (transition instanceof DialogTransition) {
                let dialog = "<div class=\"dialog\">";
                dialog += "<div class=\"title\">" + transition.phrase.getTotalText() + "</div>";

                //dialog += "<div class=\"add-action\"><button class=\"add-action-button\">Add action</button></div>";
                //dialog += "</div>";
                dialog += "</div>";

                this.$selection.append(dialog);
            }
        }
        this.$selection.append("<button id=\"add-dialog-button\">Add dialog</button>");
        let that = this;
        $("#editor #add-dialog-button").click(function() {
            that.addDialogToCharacter(character);
            $(this).blur();
        });

        this.$selection.append("<button id=\"play-button\">Play/Stop</button>");
        $("#editor #play-button").click(function() {

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