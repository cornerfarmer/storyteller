import {Story} from "./Story";
import {Editor} from "./Editor";

export class Writer {
    public canvas;
    public context;
    private width: number;
    private height: number;
    private story: Story;
    private editor: Editor;

    constructor(story: Story, editor: Editor) {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.story = story;
        this.editor = editor;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    write() {
        this.context.clearRect(0, 0, this.width, this.height);

        this.story.write(this.context);
        this.editor.write(this.context);
    }
}