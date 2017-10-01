
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
        canvas.addEventListener('click', function(evt) {
            that.onClick(that.getMousePos(canvas, evt));
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

    onClick(pos: Vector) {
        for (let actor of this.story.actors) {
            if (actor.getRect().contains(pos))
                this.editor.selectActor(actor);
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