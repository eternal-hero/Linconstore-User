import * as React from 'react';
import {Typography} from "@mui/material";
import {Box} from "@mui/system";
import { Line } from "react-chartjs-2";
import {Chart as ChartJS,BarElement,PointElement,    LineElement,
    CategoryScale, Legend, LinearScale, Title, Tooltip} from "chart.js";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    PointElement,
    Legend,
);
interface IChart {
    chart: number[],
    rate: number
}
const transformRate = (chart: number[], rate : number) => {
    const newChart : number[] = [];
    chart.forEach(x => {
        const newX = x * rate;
        newChart.push(newX)
    })
    return newChart
}
const  ChartComponent : React.FC<IChart> = ({chart, rate}) => {
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Sales',
                data: transformRate(chart, rate),
                fill: true,
                borderColor: "rgba(75,192,192,1)",
                barPercentage:1,
                categoryPercentage: 0.5,
                backgroundColor: '#60AA45',
                pointBorderWidth: 1,
                borderRadius: 50,
                barThickness :   20,
                pointHoverRadius: 5,
            },

        ]
    };
    return (
        <Box>
            <Typography variant={'h6'} fontSize={14}>This Year </Typography>
            <Line data={data}  />
        </Box>
    );
}
export default  ChartComponent;