import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [
      {
        label: 'Votes',
        data: [12, 19, 3],
        backgroundColor: ['red', 'green', 'yellow'],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
