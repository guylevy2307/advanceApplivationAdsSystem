import {CanvasJSChart} from 'canvasjs-react-charts'

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