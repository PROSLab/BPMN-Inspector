import React, { useEffect, useRef } from "react";
import { VennDiagramChart, extractSets } from "chartjs-chart-venn";
import { Chart } from "chart.js";

const ChartVenn = () => {
    const canvasRef = useRef(null);

    const config = {
        type: "venn",
        data: extractSets(
            [
                {
                    label: "Soccer",
                    values: ["alex", "casey", "drew", "hunter", "jade"]
                },
                { label: "Tennis", values: ["casey", "drew", "jade"] },
                { label: "Volleyball", values: ["drew", "glen", "jade", "hunter"] }
            ],
            {
                label: "Sports dỉagram"
            }
        ),
        options: {
            borderWidth: 2,
            backgroundColor: [
                "rgba(255, 26, 104, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ]
        }
    };

    // const config = {
    //   type: "venn",
    //   data: {
    //     labels: [
    //       "Soccer",
    //       "Tennis",
    //       "Volleyball",
    //       "Soccer ∩ Tennis",
    //       "Soccer ∩ Volleyball",
    //       "Tennis ∩ Volleyball",
    //       "Soccer ∩ Tennis ∩ Volleyball"
    //     ],
    //     datasets: [
    //       {
    //         // label: "Sports",
    //         data: [
    //           { sets: ["Soccer"], value: 3 },
    //           { sets: ["Tennis"], value: 2 },
    //           { sets: ["Volleyball"], value: ["LAK2011", "LAK2011"] },
    //           { sets: ["Soccer", "Tennis"], value: "a" },
    //           { sets: ["Soccer", "Volleyball"], value: 0 },
    //           { sets: ["Tennis", "Volleyball"], value: "a" },
    //           { sets: ["Soccer", "Tennis", "Volleyball"], value: "a" }
    //         ]
    //       }
    //     ]
    //   },
    //   options: {
    //     title: {
    //       display: true,
    //       text: "Chart.js Venn Diagram Chart"
    //     }
    //   }
    // };

    useEffect(() => {
        new VennDiagramChart(canvasRef.current, config);
    });

    return (
        <>
            <div className="App">
                <canvas ref={canvasRef} id="canvas"></canvas>
            </div>
        </>
    );
};

export default ChartVenn;
