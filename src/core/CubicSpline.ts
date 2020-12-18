import { ISpline } from '../core';

export default class CubicSpline {
    private readonly interpolationTurn: number;
    private readonly fn: any;
    private readonly xStart: number;
    private readonly xEnd: number;
    private readonly xTurn: number;

    private xGrid: number[] = [];
    private yGrid: number[] = [];
    private spline: ISpline[] = [];
    private alpha: number[] = [];
    private beta: number[] = [];

    public minY: number;
    public maxY: number;
    public points: any[] = [];
    public maxDifference: number = -1;
    public table: any[] = [];

    constructor(
        fn: Function,
        xStart: number,
        xEnd: number,
        xTurn: number,
        interpolationTurn: number = 0.01
    ) {
        this.fn = fn;
        this.xStart = xStart;
        this.xEnd = xEnd;
        this.xTurn = xTurn;
        this.interpolationTurn = interpolationTurn;
    }

    public solve(): CubicSpline {
        this.initGridAndSpline();
        this.calculateAlphaAndBeta();
        this.reverseSwapMethod();
        this.directSwapMethod();
        this.calculateInterpolation();
        this.calculateMaxDifference();
        this.initSplineAndCoeffTable();
        return this;
    }

    private initGridAndSpline(): void {
        for (let x = this.xStart; x <= this.xEnd; x += this.xTurn) {
            this.alpha.push(0);
            this.beta.push(0);
            this.xGrid.push(x);
            this.yGrid.push(this.fn(x));
            this.spline.push({
                X: this.xGrid[this.xGrid.length - 1],
                A: this.yGrid[this.yGrid.length - 1],
                B: 0,
                C: 0,
                D: 0,
            });
        }
        this.minY = Math.min.apply(Math, this.yGrid);
        this.maxY = Math.max.apply(Math, this.yGrid);
    }

    private calculateAlphaAndBeta(): void {
        for (let i = 1; i < this.spline.length - 1; i++) {
            const hi = this.xGrid[i] - this.xGrid[i - 1];
            const hi1 = this.xGrid[i + 1] - this.xGrid[i];
            const A = hi;
            const B = hi1;
            const C = 2.0 * (hi + hi1);
            const F =
                6.0 *
                ((this.yGrid[i + 1] - this.yGrid[i]) / hi1 -
                    (this.yGrid[i] - this.yGrid[i - 1]) / hi);
            const z = A * this.alpha[i - 1] + C;
            this.alpha[i] = -B / z;
            this.beta[i] = (F - A * this.beta[this.beta.length - 1]) / z;
        }
    }

    private reverseSwapMethod(): void {
        for (let i = this.spline.length - 2; i > 0; i--) {
            this.spline[i].C =
                this.alpha[i] * this.spline[i + 1].C + this.beta[i];
        }
    }

    private directSwapMethod(): void {
        for (let i = this.spline.length - 1; i > 1; i--) {
            const hi = this.xGrid[i] - this.xGrid[i - 1];
            this.spline[i].D = (this.spline[i].C - this.spline[i - 1].C) / hi;
            this.spline[i].B =
                (hi * (2.0 * this.spline[i].C + this.spline[i - 1].C)) / 6.0 +
                (this.yGrid[i] - this.yGrid[i - 1]) / hi;
        }
    }

    private interpolatePoint(x: number) {
        let spline: ISpline;
        const size: number = this.spline.length - 1;
        if (x <= this.spline[0].X) {
            spline = this.spline[0];
        } else if (x >= this.spline[size].X) {
            spline = this.spline[size];
        } else {
            spline = this.binarySearch(x);
        }
        const dx = x - spline.X;
        return (
            spline.A +
            (spline.B + (spline.C / 2.0 + (spline.D * dx) / 6.0) * dx) * dx
        );
    }

    private binarySearch(x: number): ISpline {
        let left = 0;
        let right = this.spline.length - 1;
        while (left + 1 < right) {
            const center = Math.ceil(left + (right - left) / 2);
            if (x <= this.spline[center].X) {
                right = center;
            } else {
                left = center;
            }
        }
        return this.spline[right];
    }

    private initSplineAndCoeffTable(): void {
        for (let i = 0; i < this.spline.length; i++) {
            this.table.push({
                ...this.spline[i],
                alpha: this.alpha[i],
                beta: this.beta[i],
            });
        }
    }

    private calculateMaxDifference(): void {
        for (let i = 0; i < this.spline.length - 1; i++) {
            const xCenter = (this.xGrid[i] + this.xGrid[i + 1]) / 2.0;
            const xDifference = Math.abs(
                this.fn(xCenter) - this.interpolatePoint(xCenter)
            );
            if (xDifference > this.maxDifference) {
                this.maxDifference = xDifference;
            }
        }
    }

    private calculateInterpolation(): void {
        for (let x = this.xStart; x < this.xEnd; x += this.interpolationTurn) {
            this.points.push([x, this.interpolatePoint(x)]);
        }
    }
}
