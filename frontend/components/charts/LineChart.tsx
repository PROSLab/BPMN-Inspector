import React from "react";
import { Line } from "react-chartjs-2";

const labels = ["Test"];

const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: 'Chart.js Line Chart - Multi Axis',
        },
    },
    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

const data = {
    labels: labels,
    datasets: [
        {
            label: "My First dataset",
            backgroundColor: "rgb(16,173,115)",
            borderColor: "rgb(8,59,12)",
            data: [0],
            width:"49%",
            height:"50%",
            color: "rgb(8,59,12)",
        },

    ],
};

interface Props {
    options?: any;
    data?: any;
}

const LineChart : React.FC<Props> = (props:Props) => {
    return (
        <Line data={data} options={options}/>
    );
};

export default LineChart;