import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {useMediaQuery} from "@mui/material";
import charts from "./Admin/Charts";
import { useTranslation } from "react-i18next";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
interface IChart {
    chart: number[]
}
export const options = {
    responsive: true,
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            grid: {
                display: false
            },
        },
    },
};

const ChartBar : React.FC<IChart> = ({chart}) => {
    const isMobile = useMediaQuery('(max-width: 600px)');

    const { t } = useTranslation();
    const daysInString = [t("day.Saturday"), t("day.Friday"), t("day.Thursday"), t("day.Wednesday"), t("day.Tuesday"), t("day.Monday"), t("day.Sunday")];
    const today = 6 - new Date().getDay();

    const data = {
        labels: [...daysInString.slice(today), ...daysInString.slice(0, today)],
        datasets: [
            {
                label: t("seller.store_stats.Sales"),
                data: chart,
                barPercentage: 1,
                categoryPercentage: 0.5,
                backgroundColor: '#60AA45',
                pointBorderWidth: 1,
                borderRadius: 50,
                barThickness: isMobile ? 13 : 20,
                pointHoverRadius: 5,
            }
        ],
    };

    return <Bar options={options} data={data} />;
}

export default ChartBar;