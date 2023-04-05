import React from "react";
import Chart from "chart.js/auto";
import {Bar, Radar} from "react-chartjs-2";

    const labels = ["January", "February", "March", "April", "May", "June"];
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

    const RadarChart : React.FC<Props> = (props:Props) => {
        const {options} = props;
      return(
            <Radar data={data} options={options}/>
    );
};

export default RadarChart;