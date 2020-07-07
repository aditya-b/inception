import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { PanelModel } from "../../data";
import { map, join, parseInt } from 'lodash';
import { QueryEditor } from "../../datasources";
import { strToRGBColor } from "../../ui/Colors";

interface GraphProps {
    panel: PanelModel;
}

export class Graph extends Component<GraphProps> {
    plot: any;
    plotRef: any;
    
    constructor(props: GraphProps) {
        super(props);
        const options = {
            responsive: true,
            scales: {
                xAxes: [
                    {
                        type: 'time'
                    }
                ]
            },
            animation: {
                duration: 10 // general animation time
              },
              hover: {
                animationDuration: 0 // duration of animations when hovering an item
              },
              responsiveAnimationDuration: 10, // animation duration after a resize
        }
        this.plotRef = React.createRef();
        this.plot = <Line ref={this.plotRef} data={[]} options={options} />;
    }



    render() {
        return <div className="graph-panel">
            <QueryEditor
                onDataUpdate={this.parseData}
                query='' />
            {this.plot}
        </div>
    }

    parseData = (data: any) => {
        const datasets = map(data, (dataObj, order) => {
            const { metric , tags, values } = dataObj;
            const metricStr = `${metric}: ${join(map(tags, (v,k) => `${k}-${v}`), ' ,')}`;
            const data = map(values, val => {
                return {
                    x: val[0],
                    y: parseInt(val[1].toString())
                };
            });
            const rgb = strToRGBColor(metricStr);
            const color = `rgb(${rgb})`;
            const bgColor = `rgba(${rgb}, 0.3)`;
            return {
                data,
                label: metricStr,
                order,
                borderColor: color,
                backgroundColor: bgColor,
            }
        });
        this.refresh(datasets);
    }

    refresh(datasets: any) {
        const plot = this.plotRef.current.chartInstance;
        plot.data = { datasets };
        plot.update();
    }
}