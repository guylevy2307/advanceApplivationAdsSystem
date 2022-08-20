import CanvasJSReact from '../../lib/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function BarChart({dataPoints, title}) {

    const options = {
        title: {
            text: title
        },
        data: [{
            type: "column",
            dataPoints: dataPoints
        }]
    }
    return (
        <>
            <CanvasJSChart options = {options}
            />
        </>
    )
}