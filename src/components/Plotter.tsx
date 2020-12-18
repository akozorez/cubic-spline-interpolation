import React from "react";
import { CubicSpline, Func, Hash } from "../core";
import functionPlot from 'function-plot';

export default class Plotter extends React.Component<any, any> {
    private readonly width: number;
    private readonly height: number;
    private readonly index: any;

    private readonly target: string;
    private readonly colors: string[];
    private readonly fn: Function;
    private readonly fnText: string;
    private readonly xGridTurn: number;
    private readonly xGrid: number[];
    private readonly cubicSpline: CubicSpline;

    constructor(props: any) {
        super(props);
        this.target = `func-${Hash(20)}`;
        this.fnText = props.fnText;
        this.fn = Func(this.fnText);
        this.xGrid = props.xGrid?.length >= 2 ? props.xGrid : [-100, 100];
        this.colors = props.colors?.length >= 2 ? props.colors : ["darkred", "darkblue"];
        this.xGridTurn = props.xGridTurn;
        this.cubicSpline = new CubicSpline(this.fn, this.xGrid[0], this.xGrid[1], this.xGridTurn).solve();
        this.index = props.index;
    }

    componentDidMount() {
        functionPlot({
            target: `.${this.target}`,
            data: [
                {
                    fn: this.fnText,
                    color: this.colors[0],
                    graphType: 'polyline'
                },
                {
                    fnType: 'points',
                    points: this.cubicSpline.points,
                    color: this.colors[1],
                    graphType: 'polyline'
                }
            ],
            grid: true,
            xAxis: { domain: [this.xGrid[0], this.xGrid[1]] },
            yAxis: { domain: [this.cubicSpline.minY, this.cubicSpline.maxY] },
            width: this.width || 1024,
            height: this.height || 500
        });
    }

    render() {
        return (
            <div style={{ width: `${this.width}px` }}>
                <div className={`func ${this.target}`}></div>
                {
                    console.log(this.index)
                }
                <p className="text-center pb-4 font-weight-light">Graph {this.index + 1}. Grid Points: {(this.xGrid[1] - this.xGrid[0])/this.xGridTurn}. Max diff: {this.cubicSpline.maxDifference}</p>
            </div>
        );
    }

}