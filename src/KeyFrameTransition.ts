
import {Transition} from "./Transition";
import {Phrase} from "./Phrase";
import {Teller} from "./Teller";
import {Actor} from "./Actor";
import {Vector} from "./Vector";
import {BezierCurve} from "./BezierCurve";
import {KeyFrame} from "./KeyFrame";

export class KeyFrameTransition extends Transition {
    private frames: { [index: number]: KeyFrame };
    private totalFrames: number;
    public name: string;
    private time: number;
    public currentFrameNumber: number;
    private canvasSize: Vector;

    constructor(teller: Teller, actor: Actor, start: KeyFrame) {
        super(teller, actor);
        this.name = "";
        this.frames = {};
        this.totalFrames = 180;
        this.add(start, 0);
        this.add(start.clone(), this.totalFrames - 1);
        this.currentFrameNumber = 0;
        this.canvasSize = null;
        this.reset();
    }

    protected internProceed(dt: number): boolean {
        this.time += dt;
        let frame = Math.min(this.totalFrames - 1, Math.floor(this.time * 60));
        this.setActorToFrame(frame);
        return frame >= this.totalFrames - 1;
    }

    private findFrameBeforeNumber(frameNumber: number): number {
        for (let i = frameNumber; i >= 0; i--) {
            if (this.frames.hasOwnProperty(i.toString()))
                return i;
        }
    }

    private findFrameAfterNumber(frameNumber: number): number {
        for (let i = frameNumber; i < this.totalFrames; i++) {
            if (this.frames.hasOwnProperty(i.toString()))
                return i;
        }
    }

    public setActorToFrame(frame: number) {
        let intervalStart = this.findFrameBeforeNumber(frame);
        let intervalEnd = this.findFrameAfterNumber(frame);

        if (intervalEnd === intervalStart) {
            this.actor.position = this.frames[intervalStart].position.clone();
            this.actor.rotation = this.frames[intervalStart].rotation;
        } else {
            let factor = (frame - intervalStart) / (intervalEnd - intervalStart);
            this.actor.position = this.frames[intervalStart].position.add(this.frames[intervalEnd].position.sub(this.frames[intervalStart].position).mul(factor));
            this.actor.rotation = this.frames[intervalStart].rotation + (this.frames[intervalEnd].rotation - this.frames[intervalStart].rotation) * factor;
        }
    }

    public reset() {
        this.time = 0;
    }

    public add(frame: KeyFrame, frameNumber: number) {
        this.frames[frameNumber] = frame;
    }

    public drawDebug(context) {
        if (!this.canvasSize)
            this.canvasSize = new Vector(context.canvas.width, context.canvas.height);
        context.fillStyle = "gray";
        context.fillRect(0, context.canvas.height - 40, context.canvas.width, 40);

        context.lineWidth = 3;
        context.strokeStyle = "white";
        this.drawFrame(context, this.currentFrameNumber);

        for (let frameNumber in this.frames) {
            context.strokeStyle = parseInt(frameNumber) === this.currentFrameNumber ? "yellow" : "green";
            this.drawFrame(context, parseInt(frameNumber));
        }
    }

    private drawFrame(context, frameNumber: number) {
        context.beginPath();
        context.moveTo(context.canvas.width * frameNumber / (this.totalFrames - 1), context.canvas.height - 40);
        context.lineTo(context.canvas.width * frameNumber / (this.totalFrames - 1), context.canvas.height);
        context.stroke();
    }

    public ray(vec: Vector) {
        if (vec.y > this.canvasSize.y - 40) {
            this.currentFrameNumber = Math.floor(vec.x / this.canvasSize.x * this.totalFrames);
            this.setActorToFrame(this.currentFrameNumber);
        }
    }

    public getLabel(): string {
        return this.name;
    }
}