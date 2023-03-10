import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const labels = ["January", "February", "March", "April", "May", "June"];

const data = {
    labels: labels,
    datasets: [
        {
            label: "My First dataset",
            backgroundColor: "rgb(16,173,115)",
            borderColor: "rgb(8,59,12)",
            data: [0, 10, 5, 2, 20, 30, 45],
            width:"49%",
            height:"50%",
            color: "rgb(8,59,12)",
        },
    ],
};

interface options {
    responsive: boolean,
    maintainAspectRatio: boolean,
    height: string,
    width: string,
};

interface Props {
    options?: options;
    data?: any;
}

const LineChart : React.FC<Props> = (props:Props) => {
    const {options} = props;
    return (
        <Line data={data} options={options}/>
    );
};

export default LineChart;