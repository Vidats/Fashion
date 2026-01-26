import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function RevenueChart({ data }) {
    const chartData = {
        labels: data.map((item) => item._id),
        datasets: [
            {
                label: 'Doanh thu',
                data: data.map((item) => item.dailyRevenue),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Doanh thu 7 ngày gần nhất',
            },
        },
    };

    return <Line options={options} data={chartData} />;
}
