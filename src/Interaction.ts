
import {Vector} from "./Vector";
import {Story} from "./Story";
import {Editor} from "./Editor";

export class Interaction {

    private story: Story;
    private editor: Editor;

    constructor(canvas, story: Story, editor: Editor) {
        this.story = story;
        this.editor = editor;

        let that = this;
        canvas.addEventListener('mousedown', function(evt) {
            that.onMouseDown(that.getMousePos(canvas, evt));
        }, false);
        canvas.addEventListener('mouseup', function(evt) {
            that.onMouseUp(that.getMousePos(canvas, evt));
        }, false);
        canvas.addEventListener('mousemove', function(evt) {
            that.onMouseMove(that.getMousePos(canvas, evt));
        }, false);
        window.addEventListener('keypress', function(e) {
             let key = "";
             if (e.keyCode === 13)
                 key = "\n";
             else if (e.key.length === 1)
                 key = e.key;
             that.onKeyPress(key, e.keyCode === 8);
        });
    }

    onMouseDown(pos: Vector) {
        if (this.editor.isActive) {
            this.editor.onMouseDown(pos);
        }
    }

    onMouseUp(pos: Vector) {
        if (this.editor.isActive) {
            this.editor.onMouseUp(pos);
        }
    }

    onMouseMove(pos: Vector) {
        if (this.editor.isActive) {
            this.editor.onMouseMove(pos);
        }
    }

    onKeyPress(key: string, backspace: boolean) {
        if (this.editor.isActive) {
            if (backspace)
                this.editor.removeLastChar();
            else
                this.editor.enterText(key);
        } else {
            if (backspace)
                this.story.player.removeLastChar();
            else
                this.story.player.enterText(key);
        }
    }

    getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
    }
}