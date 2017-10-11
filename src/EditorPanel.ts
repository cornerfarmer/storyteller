/// <reference path="../node_modules/@types/jquery/index.d.ts" />
import * as $ from "jquery";
import {Editor} from "./Editor";
import {Actor} from "./Actor";
import {EditorPanelInterface} from "./EditorPanelInterface";
import {Teller} from "./Teller";
import {Vector} from "./Vector";

export abstract class EditorPanel<T> implements EditorPanelInterface {
    private $panel;
    private name: string;
    protected editor: Editor;
    protected teller: Teller;
    public selectedElement: T;

    constructor(name, editor: Editor, teller: Teller) {
        this.$panel = $('#' + name);
        this.name = name;
        this.editor = editor;
        this.teller = teller;
        this.selectedElement = null;
    }

    public addNewElement() {
        this.selectedElement = this.createNewElement();
        if (this.selectedElement !== null) {
            this.saveElement(this.selectedElement);
            this.getElements().push(this.selectedElement);
            this.refresh();
        }
    }

    public selectElement(element: T) {
        this.selectedElement = element;
        this.refresh();
    }

    protected getSelectedActor(): Actor {
        return this.editor.selectedActor;
    }

    protected abstract createNewElement(): T;
    protected abstract getElements(): Array<T>;
    protected abstract getLabelForElement(element: T): string;
    public enterText(text: string) {};
    public removeLastChar() {};
    public write(context) {};
    public onMouseUp(pos: Vector) {};
    public onMouseDown(pos: Vector) {};
    public onMouseMove(pos: Vector) {};
    protected addElementToolbar($panel, element: T) {};
    protected getJQueryElement(id: string) {
        return this.$panel.find("#" + id);
    }
    protected saveElement(element: T) {};

    public refresh() {
        let that = this;

        this.$panel.empty();
        this.$panel.append("<h3>" + this.name + "</h3>");

        let i = 0;
        for (let element of this.getElements()) {
            this.$panel.append("<div id=\"" + this.name + "-" + i + "\">" + this.getLabelForElement(element) + "</div>");
            $("#editor #" + this.name + "-" + i).click(function () {
                that.selectElement(element);
                $(this).blur();
            });
            i++;
        }

        this.addElementToolbar(this.$panel, this.selectedElement);

        this.$panel.append("<button id=\"save-" + this.name + "-button\">Save</button>");
        $("#editor #save-" + this.name + "-button").click(function () {
            that.saveElement(that.selectedElement);
            that.refresh();
            $(this).blur();
        });

        this.$panel.append("<button id=\"add-" + this.name + "-button\">Create</button>");
        $("#editor #add-" + this.name + "-button").click(function () {
            that.addNewElement();
            $(this).blur();
        });
    }
}