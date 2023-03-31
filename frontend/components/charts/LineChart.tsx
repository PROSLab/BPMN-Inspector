import React from "react";
import { Line } from "react-chartjs-2";

const labels = ["Test"];

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

interface options {
    responsive: boolean,
    maintainAspectRatio: boolean,
    height: string,
    width: string,
};

interface Props {
    options?: any;
    data?: any;
}

const LineChart : React.FC<Props> = (props:Props) => {
    const {options} = props;
    return (
        <Line data={data} options={options}/>
    );
};

export default LineChart;