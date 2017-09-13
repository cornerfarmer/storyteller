import {Story} from "./Story";

export class Writer {
    private canvas;
    private context;
    private width: number;
    private height: number;
    private story: Story;

    constructor(story: Story) {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.story = story;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    write() {
        this.context.clearRect(0, 0, this.width, this.height);

        this.story.write(this.context);
    }
}