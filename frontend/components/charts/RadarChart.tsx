import React, {useRef} from "react";
import Chart from "chart.js/auto";
import {Bar, getElementsAtEvent, Radar} from "react-chartjs-2";

    const labels = [""];
    const data = {
        labels: labels,
        datasets: [
            {
                borderWidth: 1,
                label: "My First dataset",
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                data: [0, 10, 5, 2, 20, 30, 45],
                link: ['']
            },
        ],
    };

const options = {
};

interface Props {
    options?: any;
    data?: any;
}

// @ts-ignore
const chartRef = useRef();
const onClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
// @ts-ignore
    getElementsAtEvent(chartRef.current, event)
    // @ts-ignore
    const datasetIndexNum = getElementsAtEvent(chartRef.current, event)[0].datasetIndex;
    // @ts-ignore
    const dataPoint = getElementsAtEvent(chartRef.current, event)[0].index;
}


const RadarChart : React.FC<Props> = (props:Props) => {
      return(
            <Radar data={data} options={options} onClick={onClick} ref={chartRef} />
    );

};

export default RadarChart;