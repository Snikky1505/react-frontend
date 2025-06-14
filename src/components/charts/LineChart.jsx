// components/LineChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Total Search',
        data: [5687, 11122, 10000, 11972],
        borderColor: '#fff',
        backgroundColor: 'rgba(255,255,255,0.2)',
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff', // warna teks legend
        },
        position: 'top',
      },
      title: {
        display: false,
        color: '#fff',
      },
      tooltip: {
        bodyColor: '#fff',
        titleColor: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff', // warna label sumbu X
        },
        grid: {
          color: 'rgba(255,255,255,0.1)', // warna garis grid
        },
      },
      y: {
        ticks: {
          color: '#fff', // warna label sumbu Y
        },
        grid: {
          color: 'rgba(255,255,255,0.1)', // warna garis grid
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
