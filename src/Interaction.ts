
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
            that.onKeyPress(e.key);
        });
    }

    onClick(pos: Vector) {
        for (let actor of this.story.actors) {
            if (actor.getRect().contains(pos))
                this.editor.selectActor(actor);
        }
    }

    onKeyPress(key: string) {
        this.editor.enterText(key);
    }

    getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
    }
}