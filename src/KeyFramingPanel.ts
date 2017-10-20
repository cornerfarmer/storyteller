/// <reference path="../node_modules/@types/jquery/index.d.ts" />
import * as $ from "jquery";
import {EditorPanel} from "./EditorPanel";
import {DialogTransition} from "./DialogTransition";
import {Editor} from "./Editor";
import {Phrase} from "./Phrase";
import {Word} from "./Word";
import {Teller} from "./Teller";
import {MovementTransition} from "./MovementTransition";
import {Vector} from "./Vector";
import {Story} from "./Story";
import {KeyFrameTransition} from "./KeyFrameTransition";
import {KeyFrame} from "./KeyFrame";

export class KeyFramingPanel extends EditorPanel<KeyFrameTransition> {

    constructor(editor: Editor, teller: Teller, story: Story) {
        super("keyframe-movements", editor, teller, story);
    }

    protected createNewElement(): KeyFrameTransition {
        let keyFrame = new KeyFrame(this.getSelectedActor().position.clone(), this.getSelectedActor().rotation);
        return new KeyFrameTransition(this.teller, this.getSelectedActor(), keyFrame);
    }

    protected addElementToElements(element: KeyFrameTransition) {
        this.getSelectedActor().addTransition(element);
        return this.getSelectedActor().transitions.length - 1;
    }

    protected getElements(): Array<KeyFrameTransition> {
        let elements = [];
        for (let transition of this.getSelectedActor().transitions) {
            if (transition instanceof KeyFrameTransition) {
                elements.push(transition);
            }
        }
        return elements;
    }

    protected getLabelForElement(element: KeyFrameTransition): string {
        return element.name;
    }

    protected addElementToolbar($panel, element: KeyFrameTransition) {
        let that = this;
        $panel.append("<input id=\"name-input\" value=\"" + element.name + "\">");
        $panel.find("#name-input").change(function () {
            that.selectedElement.name = $(this).val();
            that.refresh();
        });

        $panel.append("<button id=\"add-keyframe\">Add keyframe</button>");
        $("#editor #add-keyframe").click(function () {
            that.selectedElement.add(new KeyFrame(that.getSelectedActor().position.clone(), that.getSelectedActor().rotation), that.selectedElement.currentFrameNumber);
            $(this).blur();
        });
    }


    public write(context) {
        if (this.selectedElement)
            this.selectedElement.drawDebug(context);
    }


    public onMouseUp(pos: Vector) {
        if (this.selectedElement) {
            this.selectedElement.ray(pos);
        }
    }

    public onMouseDown(pos: Vector) {

    }

    public onMouseMove(pos: Vector) {
    }
}