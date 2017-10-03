
import {Vector} from "./Vector";

export class BezierCurve {
    public points: Array<Vector>;
    private lengths: Array<number>;
    private numberOfLengths: number;
    private totalLength: number;

    constructor(startPoint: Vector, endPoint: Vector) {
        this.points = [];
        this.points.push(startPoint);
        this.points.push(new Vector((endPoint.x - startPoint.x) / 4 + startPoint.x, (endPoint.y - startPoint.y) / 4 + startPoint.y));
        this.points.push(new Vector((endPoint.x - startPoint.x) / 4 * 3 + startPoint.x, (endPoint.y - startPoint.y) / 4 * 3 + startPoint.y));
        this.points.push(endPoint);
        this.numberOfLengths = 500;
        this.lengths = new Array(this.numberOfLengths + 1);
        this.calcLengths();
    }


    public drawDebug(context, isLast: boolean) {
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        context.bezierCurveTo(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y, this.points[3].x, this.points[3].y);
        context.stroke();

        this.drawPoint(context, this.points[0], false);
        this.drawPoint(context, this.points[1], true);
        this.drawPoint(context, this.points[2], true);
        if (isLast)
            this.drawPoint(context, this.points[3], false);
    }

    private drawPoint(context, point: Vector, isControl: boolean) {
        context.fillStyle = isControl ? 'yellow' : 'red';
        context.fillRect(point.x - 5, point.y - 5, 10, 10);
    }


    public ray(vec: Vector, isLast: boolean): number {
        if (this.rayPoint(vec, this.points[0]))
            return 0;
        if (this.rayPoint(vec, this.points[1]))
            return 1;
        if (this.rayPoint(vec, this.points[2]))
            return 2;
        if (isLast && this.rayPoint(vec, this.points[3]))
            return 3;
        return null;
    }

    private rayPoint(vec: Vector, point: Vector) {
        return (point.x - 5 <= vec.x && point.y - 5 <= vec.y && point.x + 5 >= vec.x && point.y + 5 >= vec.y);
    }

    public movePoint(pointId: number, newPos: Vector) {
        this.points[pointId].x = newPos.x;
        this.points[pointId].y = newPos.y;
        this.calcLengths();
    }

    private calcLengths() {
        this.lengths[0] = 0;
        let ox = this.points[0].x, oy = this.points[0].y;
        for (let i = 1;  i < this.lengths.length; i++) {
            let x = this.x(i / this.numberOfLengths);
            let y = this.y(i / this.numberOfLengths);

            this.lengths[i] = this.lengths[i - 1] + Math.sqrt((ox - x) * (ox - x) + (oy - y) * (oy - y));
            ox = x;
            oy = y;
        }
        this.totalLength = this.lengths[this.lengths.length - 1];
    }

    public x(t): number {
        return ((1 - t) * (1 - t) * (1 - t)) * this.points[0].x
               + 3 * ((1 - t) * (1 - t)) * t * this.points[1].x
               + 3 * (1 - t) * (t * t) * this.points[2].x
               + (t * t * t) * this.points[3].x;
    }

    public y(t): number {
        return ((1 - t) * (1 - t) * (1 - t)) * this.points[0].y
               + 3 * ((1 - t) * (1 - t)) * t * this.points[1].y
               + 3 * (1 - t) * (t * t) * this.points[2].y
               + (t * t * t) * this.points[3].y;
    }

    public setPosAtTime(t: number, pos: Vector): number  {
        if (t > this.totalLength)
            return t - this.totalLength;
        else {
            for (let i = 0;  i < this.lengths.length; i++) {
                if (this.lengths[i] > t) {
                    pos.x = this.x(i / this.numberOfLengths);
                    pos.y = this.y(i / this.numberOfLengths);
                    return 0;
                }
            }
        }
    }
}