
import {Editor} from "./Editor";
import {Actor} from "./Actor";
import {Vector} from "./Vector";

export interface EditorPanelInterface {
    enterText(text: string);
    removeLastChar();
    refresh();
    write(context);
    onMouseUp(pos: Vector);
    onMouseDown(pos: Vector);
    onMouseMove(pos: Vector);
}