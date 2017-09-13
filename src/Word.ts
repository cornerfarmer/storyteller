export class Word {
    public text: string;
    public speed: number;
    public font: string;
    public font_size: number
    public color;
    public time: number;
    public pauseAfter: number;
    private globalPosition: number;

    constructor(text: string) {
        this.text = text;
        this.speed = 1;
        this.font = "Georgia";
        this.font_size = 20;
        this.time = 0;
        this.pauseAfter = 0.2;
        this.speed = 0.02; 
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
    }

    write(context, parentPosition) {
        if (this.time > 0) {
            this.prepareContext(context);
            context.fillText(this.text.substring(0, this.time / this.speed), parentPosition + this.globalPosition, 50);
        }
    }


    calcPosition(context, x: number): number {
        this.prepareContext(context);
        this.globalPosition = x;
        return context.measureText(this.text + " ").width + x;
    }
}