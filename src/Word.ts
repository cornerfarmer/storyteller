import {Vector} from "./Vector";

export class Word {
    public text: string;
    public speed: number;
    public font: string;
    public font_size: number;
    public color;
    public time: number;
    public pauseAfter: number;
    private globalPosition: Vector;
    public newLineAfterwards: boolean;

    constructor(text: string, newLineAfterwards: boolean = false, font_size: number = 20) {
        this.text = text;
        this.speed = 1;
        this.font = "Georgia";
        this.font_size = font_size;
        this.time = 0;
        this.pauseAfter = 0;
        this.speed = 0.05;
        this.newLineAfterwards = newLineAfterwards;
    }

    proceed(dt: number) {
        this.time += dt;
        if (this.time >= this.getTotalTime()) {
            var diff = this.time - this.getTotalTime();
            this.time = this.getTotalTime();
            return diff;
        } else
            return -1;
    }

    getTotalTime(): number {
        return this.text.length * this.speed + this.pauseAfter;
    }

    private prepareContext(context) {
        context.font = this.font_size + "px " + this.font;
        context.textBaseline = "alphabetic";
        context.fillStyle = "black";
        context.textAlign = "left";
    }

    write(context, parentPosition: Vector) {
        if (this.time > 0) {
            this.prepareContext(context);
            let pos = parentPosition.add(this.globalPosition);
            context.fillText(this.text.substring(0, this.time / this.speed), pos.x, pos.y);
        }
    }

    calcPosition(context, globalPosition: Vector, maxFontSize: number): Vector {
        this.prepareContext(context);
        this.globalPosition = globalPosition.clone();
        this.globalPosition.y += maxFontSize;
        //measureText();
        let box = context.measureText(this.text);
        return new Vector(globalPosition.x + box.width, globalPosition.y);
    }
}