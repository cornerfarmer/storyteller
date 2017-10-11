
import {Transition} from "./Transition";
import {Phrase} from "./Phrase";
import {Teller} from "./Teller";
import {Actor} from "./Actor";
import {Vector} from "./Vector";
import {BezierCurve} from "./BezierCurve";

export class MovementTransition extends Transition {
    private curves: Array<BezierCurve>;
    private time: number;
    private currentCurveId: number;
    public name: string;
    public speed: number;

    constructor(teller: Teller, actor: Actor, startPoint: Vector, endPoint: Vector) {
        super(teller, actor);
        this.curves = [new BezierCurve(startPoint, endPoint)];
        this.name = "";
        this.speed = 100;
        this.reset();
    }

    protected internProceed(dt: number): boolean {
        this.time += dt * this.speed;
        return this.setPosToCurrentTime();
    }

    private setPosToCurrentTime(): boolean {
        if (this.currentCurveId < this.curves.length) {
            let timeLeft = this.curves[this.currentCurveId].setPosAtTime(this.time, this.actor.position);
            if (timeLeft > 0) {
                this.time = timeLeft;
                this.currentCurveId++;
                return this.setPosToCurrentTime();
            }
        }
        return this.currentCurveId >= this.curves.length;
    }

    public reset() {
        this.time = 0;
        this.currentCurveId = 0;
    }

    public add(point: Vector) {
        let lastCurve = this.curves[this.curves.length - 1];
        this.curves.push(new BezierCurve(lastCurve.points[lastCurve.points.length - 1].clone(), point));
    }

    public drawDebug(context) {
        for (let curveId in this.curves)
            this.curves[curveId].drawDebug(context, curveId == this.curves.length - 1);
    }

    public ray(vec: Vector): number {
        for (let curveId in this.curves) {
            let pointId = this.curves[curveId].ray(vec, curveId == this.curves.length - 1);
            if (pointId !== null)
                return pointId + curveId * 4;
        }
        return null;
    }

    public movePoint(pointId: number, newPos: Vector) {
        let curveId = Math.floor(pointId / 4);
        pointId = pointId % 4;
        let prevPoint = this.curves[curveId].points[pointId].clone();
        this.curves[curveId].movePoint(pointId, newPos);

        if (pointId == 0 && curveId > 0)
            this.curves[curveId - 1].movePoint(3, this.curves[curveId].points[0]);
        else if (pointId == 1 && curveId > 0)
            this.curves[curveId - 1].movePoint(2, this.curves[curveId].points[0].add(this.curves[curveId].points[0].sub(this.curves[curveId].points[1])));
        else if (pointId == 2 && curveId < this.curves.length - 1)
            this.curves[curveId + 1].movePoint(1, this.curves[curveId].points[3].add(this.curves[curveId].points[3].sub(this.curves[curveId].points[2])));
        else if (pointId == 3 && curveId < this.curves.length - 1)
            this.curves[curveId + 1].movePoint(0, this.curves[curveId].points[3]);

        if (pointId == 0)
            this.movePoint(curveId * 4 + pointId + 1, newPos.sub(prevPoint).add(this.curves[curveId].points[1]));
        else if (pointId == 3)
            this.movePoint(curveId * 4 + pointId - 1, newPos.sub(prevPoint).add(this.curves[curveId].points[2]));
    }

    public getLabel(): string {
        return this.name;
    }
}