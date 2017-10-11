
import {EditorPanel} from "./EditorPanel";
import {DialogTransition} from "./DialogTransition";
import {Editor} from "./Editor";
import {Phrase} from "./Phrase";
import {Word} from "./Word";
import {Teller} from "./Teller";
import {State} from "./State";

export class StatesPanel extends EditorPanel<State> {

    constructor(editor: Editor, teller: Teller) {
        super("states", editor, teller);
    }

    protected createNewElement(): State {
        return null;
    }

    protected getElements(): Array<State> {
        return this.getSelectedActor().states;
    }

    protected getLabelForElement(element: State): string {
        return element.name;
    }

    public refresh(): any {
        this.selectedElement = this.getElements()[0];
        return super.refresh();
    }
}