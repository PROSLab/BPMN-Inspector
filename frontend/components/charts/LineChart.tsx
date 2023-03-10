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

const options = {
    responsive: true,
    maintainAspectRatio: false,
    height: '60%',
    width: '30%',
};
const LineChart = () => {
    return (
        <div>
            <Line data={data} options={options}/>
        </div>
    );
};

export default LineChart;