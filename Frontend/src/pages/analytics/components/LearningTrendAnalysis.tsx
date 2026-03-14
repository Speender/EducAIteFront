import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const LearningTrendAnalysis = () => {
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Hours Studied',
        data: [12, 19, 15, 22, 18, 25],
        backgroundColor: '#00CEC8', // Brand cyan
        borderRadius: 25, // Smooth rounded corners on bars
        barThickness: 150,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#00CEC8',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  };

  return (
    <div className="w-full border border-white/20 rounded-[32px] p-8 bg-black mt-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-1">Learning <span className="text-[#00CEC8]">Trend Analysis</span></h2>
        <p className="text-white/60 text-lg">Hours studied over the last 6 weeks</p>
      </div>
      <div className="h-[300px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default LearningTrendAnalysis;