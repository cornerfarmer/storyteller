/// <reference path="../node_modules/@types/jquery/index.d.ts" />
import * as $ from "jquery";
import {Editor} from "./Editor";
import {Actor} from "./Actor";
import {EditorPanelInterface} from "./EditorPanelInterface";
import {Teller} from "./Teller";
import {Vector} from "./Vector";
import {Story} from "./Story";

export abstract class EditorPanel<T> implements EditorPanelInterface {
    protected $panel;
    private name: string;
    protected editor: Editor;
    protected teller: Teller;
    protected story: Story;
    public selectedElement: T;
    public selectedElementIndex: number;

    constructor(name, editor: Editor, teller: Teller, story: Story) {
        this.$panel = $('#' + name);
        this.name = name;
        this.editor = editor;
        this.teller = teller;
        this.story = story;
        this.selectedElement = null;
        this.selectedElementIndex = -1;
    }

    public addNewElement() {
        this.addElementToElements(this.selectedElement);
        this.refresh();
    }

    public selectElement(element: T, index: number) {
        this.selectedElement = element;
        this.selectedElementIndex = index;
        this.refresh();
    }

    protected getSelectedActor(): Actor {
        return this.editor.selectedActor;
    }

    protected abstract createNewElement(): T;
    protected abstract addElementToElements(element: T): number;
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

    public deselect() {
        this.selectElement(null, -1);
    }

    public refresh() {
        let that = this;

        this.$panel.empty();
        this.$panel.append("<h3>" + this.name + "</h3>");

        let i = 0;
        for (let element of this.getElements()) {
            this.$panel.append("<div id=\"" + this.name + "-" + i + "\">" + this.getLabelForElement(element) + "</div>");
            let index = i;
            $("#editor #" + this.name + "-" + i).click(function () {
                that.editor.deselectAll();
                that.selectElement(element, index);
                $(this).blur();
            });
            i++;
        }

        if (this.selectedElement !== null) {
            this.addElementToolbar(this.$panel, this.selectedElement);

            if (this.getElements().indexOf(this.selectedElement) == -1) {
                this.$panel.append("<br><button id=\"add-" + this.name + "-button\">Add</button>");
                $("#editor #add-" + this.name + "-button").click(function () {
                    that.addNewElement();
                    $(this).blur();
                });
            } else {
                this.$panel.append("<br><button id=\"new-" + this.name + "-button\">New</button>");
                $("#editor #new-" + this.name + "-button").click(function () {
                    that.selectedElement = that.createNewElement();
                    that.refresh();
                    $(this).blur();
                });
            }
        } else {
            this.$panel.append("<br><button id=\"new-" + this.name + "-button\">New</button>");
            $("#editor #new-" + this.name + "-button").click(function () {
                that.editor.deselectAll();
                that.selectedElement = that.createNewElement();
                that.selectedElementIndex = -1;
                that.refresh();
                $(this).blur();
            });
        }
    }
}