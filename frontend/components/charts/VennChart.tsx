import React, { Component } from 'react';
import zingchart from 'zingchart';

interface ChartComponentProps {
    dataSets: { value: string; percentage: string }[];
}

class ChartComponent extends Component<ChartComponentProps> {
    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    renderChart() {
        const { dataSets } = this.props;

        const seriesData = dataSets
            .filter((data) => parseFloat(data.percentage) !== 0)
            .map((data, index) => ({
                values: [parseFloat(data.percentage)],
                text: `${data.value.replace(/-/g, '\n')}`,
                tooltip: {
                    text: `${data.value}`,
                },
                scaleX: index + 1,
            }));

        let minExit = '0%';

        if (seriesData.length > 0) {
            minExit = `${seriesData[seriesData.length - 1].values[0]}%`;
        }

        const myConfig = {
            type: 'funnel',
            plot: {
                startWidth: 'dynamic',
                minExit: minExit,
                valueBox: {
                    text: '%v%',
                    placement: 'center',
                    fontFamily: 'Tahoma',
                    fontColor: '#ffffff',
                    fontSize: 12,
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                },
                animation: {
                    effect: 'ANIMATION_FADE_IN',
                },
            },
            scaleY: {
                labels: seriesData.map((data) => data.text),
                scaleLabel: {
                    fontFamily: 'Arial',
                    fontSize: 8,
                    fontWeight: 'bold',
                    fontColor: '#333333',
                },
            },
            series: seriesData,
        };

        zingchart.render({
            id: 'myChart',
            data: myConfig,
            height: '800px',
            width: '100%',
        });
    }

    render() {
        return (
            <div id="chartVPC">
                <div id="myChart" style={{ marginLeft: '100px', marginTop:"-21px", zIndex:"-1" }}></div>
            </div>
        );
    }
}

export default ChartComponent;
