
import {Transition} from "./Transition";
import {Phrase} from "./Phrase";
import {Teller} from "./Teller";
import {Actor} from "./Actor";
import {Vector} from "./Vector";

export class MovementTransition extends Transition {
    public points: Array<Vector>;
    public vectors: Array<Vector>;
    public controlPoints: Array<Array<Vector>>;
    private time: number;
    private totalTime: number;

    constructor(teller: Teller, actor: Actor, startPoint: Vector, endPoint: Vector) {
        super(teller, actor);
        this.points = [startPoint, endPoint];
        this.vectors = [
            new Vector((endPoint.x - startPoint.x) / 4, (endPoint.y - startPoint.y) / 4),
            new Vector((endPoint.x - startPoint.x) / 4, (endPoint.y - startPoint.y) / 4)
        ];
        this.calcControlPoints();
        this.time = 0;
        this.totalTime = 1;
    }

    protected internProceed(dt: number): boolean {
        this.time += dt;
        return this.time >= this.totalTime;
    }

    public reset() {
        this.time = 0;
    }

    public add(point: Vector, vector: Vector) {
        this.points.push(point);
        this.vectors.push(vector);
        this.calcControlPoints();
    }

    private calcControlPoints() {
        this.controlPoints = [];

        for (let pointId = 0; pointId < this.points.length; pointId++) {
            if (pointId < this.points.length - 1) {
                let firstControlPoint = new Vector(this.points[pointId].x + this.vectors[pointId].x, this.points[pointId].y + this.vectors[pointId].y);
                let secondControlPoint = new Vector(this.points[pointId + 1].x - this.vectors[pointId + 1].x, this.points[pointId + 1].y - this.vectors[pointId + 1].y);
                this.controlPoints.push([firstControlPoint, secondControlPoint]);
            }
        }
    }

    public drawDebug(context) {
        for (let pointId = 0; pointId < this.points.length; pointId++) {

            if (pointId < this.points.length - 1) {
                context.beginPath();
                context.moveTo(this.points[pointId].x, this.points[pointId].y);
                context.bezierCurveTo(this.controlPoints[pointId][0].x, this.controlPoints[pointId][0].y, this.controlPoints[pointId][1].x, this.controlPoints[pointId][1].y, this.points[pointId + 1].x, this.points[pointId + 1].y);
                context.stroke();

                this.drawPoint(context, this.points[pointId], false);
                this.drawPoint(context, this.controlPoints[pointId][0], true);
                this.drawPoint(context, this.controlPoints[pointId][1], true);

            } else
                this.drawPoint(context, this.points[pointId], false);
        }
    }

    private drawPoint(context, point: Vector, isControl: boolean) {
        context.fillStyle = isControl ? 'yellow' : 'red';
        context.fillRect(point.x - 5, point.y - 5, 10, 10);
    }

    public ray(vec: Vector): Vector {
        for (let point of this.points) {
            if (this.rayPoint(vec, point))
                return point;
        }

        for (let points of this.controlPoints) {
            if (this.rayPoint(vec, points[0]))
                return points[0];
            if (this.rayPoint(vec, points[1]))
                return points[1];
        }
    }

    private rayPoint(vec: Vector, point: Vector) {
        return (point.x - 5 < vec.x && point.y - 5 < vec.y && point.x + 5 > vec.x && point.y + 5 > vec.y);
    }
}