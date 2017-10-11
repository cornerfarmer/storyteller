
import {EditorPanel} from "./EditorPanel";
import {DialogTransition} from "./DialogTransition";
import {Editor} from "./Editor";
import {Phrase} from "./Phrase";
import {Word} from "./Word";
import {Teller} from "./Teller";

export class DialogsPanel extends EditorPanel<DialogTransition> {
    private nextInputIsNewWord: boolean;

    constructor(editor: Editor, teller: Teller) {
        super("dialogs", editor, teller);
    }

    protected createNewElement(): DialogTransition {
        let dialogTransition = new DialogTransition(new Phrase(), this.teller, this.getSelectedActor());
        this.getSelectedActor().addTransition(dialogTransition);
        this.getSelectedActor().setActivePhrase(dialogTransition.phrase);
        this.nextInputIsNewWord = true;
        return dialogTransition
    }

    protected getElements(): Array<DialogTransition> {
        let elements = [];
        for (let transition of this.getSelectedActor().transitions) {
            if (transition instanceof DialogTransition) {
                elements.push(transition);
            }
        }
        return elements;
    }

    protected getLabelForElement(element: DialogTransition): string {
        return element.phrase.getTotalText();
    }


    public selectElement(element: DialogTransition) {
        super.selectElement(element);
        this.getSelectedActor().setActivePhrase(element.phrase);
        element.phrase.proceed(element.phrase.getTotalTime() + 0.01);
    }

    public enterText(text: string) {
        if (this.selectedElement !== null) {
            let selectedPhrase = this.selectedElement.phrase;

            if (text === " ") {
                this.nextInputIsNewWord = true;
            } else if (text === "\n") {
                this.nextInputIsNewWord = true;
                if (selectedPhrase.words.length > 0)
                    selectedPhrase.words[selectedPhrase.words.length - 1].newLineAfterwards = true;
            } else {
                if (this.nextInputIsNewWord) {
                    selectedPhrase.words.push(new Word(""));
                    this.nextInputIsNewWord = false;
                }
                let word = selectedPhrase.words[selectedPhrase.words.length - 1];
                word.text += text;
                word.time = word.getTotalTime();
                selectedPhrase.recalculatePositions();
                this.refresh();
            }
        }
    }

    public removeLastChar() {
         if (this.selectedElement !== null) {
             let selectedPhrase = this.selectedElement.phrase;
             if (selectedPhrase.words.length > 0) {
                 let word = selectedPhrase.words[selectedPhrase.words.length - 1];
                 if (word.text.length > 1 || (word.text.length > 0 && selectedPhrase.words.length === 1))
                     word.text = word.text.substring(0, word.text.length - 1);
                 else if (selectedPhrase.words.length > 1)
                     selectedPhrase.words.pop();
                 this.refresh();
             }
         }
    }
}