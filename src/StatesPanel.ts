
import {EditorPanel} from "./EditorPanel";
import {DialogTransition} from "./DialogTransition";
import {Editor} from "./Editor";
import {Phrase} from "./Phrase";
import {Word} from "./Word";
import {Teller} from "./Teller";
import {State} from "./State";
import {Story} from "./Story";

export class StatesPanel extends EditorPanel<State> {

    constructor(editor: Editor, teller: Teller, story: Story) {
        super("states", editor, teller, story);
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