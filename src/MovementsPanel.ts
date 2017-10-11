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

export class MovementsPanel extends EditorPanel<MovementTransition> {
    private selectedMovementPointId: number;

    constructor(editor: Editor, teller: Teller) {
        super("movements", editor, teller);
        this.selectedMovementPointId = null;
    }

    protected createNewElement(): MovementTransition {
        let transition = new MovementTransition(this.teller, this.getSelectedActor(), this.getSelectedActor().position.clone(), this.getSelectedActor().position.add(new Vector(200, 0)));
        this.getSelectedActor().addTransition(transition);
        return transition;
    }

    protected saveElement(element: MovementTransition) {
        element.name = this.getJQueryElement("name-input").val();
    }

    protected getElements(): Array<MovementTransition> {
        let elements = [];
        for (let transition of this.getSelectedActor().transitions) {
            if (transition instanceof MovementTransition) {
                elements.push(transition);
            }
        }
        return elements;
    }

    protected getLabelForElement(element: MovementTransition): string {
        return element.name;
    }

    addPointToMovement() {
        this.selectedElement.add(new Vector(0, 0));
    }

    protected addElementToolbar($panel, element: MovementTransition) {
        let that = this;
        $panel.append("<input id=\"name-input\" value=\"" + (element == null ? "Name" : element.name) + "\">");
        $panel.append("<button id=\"add-point-button\">Add point</button>");
        $("#editor #add-point-button").click(function () {
            that.addPointToMovement();
            $(this).blur();
        });
    }


    public write(context) {
        if (this.selectedElement)
            this.selectedElement.drawDebug(context);
    }


    public onMouseUp(pos: Vector) {
        this.selectedMovementPointId = null;
    }

    public onMouseDown(pos: Vector) {
        if (this.selectedElement) {
            this.selectedMovementPointId = this.selectedElement.ray(pos);
        }
    }

    public onMouseMove(pos: Vector) {
        if (this.selectedMovementPointId !== null) {
            this.selectedElement.movePoint(this.selectedMovementPointId, pos);
        }
    }
}