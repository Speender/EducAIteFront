import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const BestPerformingCourse = () => {
  const chartData = {
    labels: [
      'Database Management', 
      'Human Computer Interaction', 
      'Artificial Intelligence', 
      'Android Programming'
    ],
    datasets: [
      {
        label: 'Average Score (%)',
        data: [94, 88, 82, 75],
        // Adding a gradient-like array of colors or just a solid color
        backgroundColor: ['#2563eb', '#ec4899', '#eab308', '#22c55e'],
        borderRadius: 15,
        barThickness: 40,
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y' as const, // THIS makes it a horizontal bar chart!
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', stepSize: 25 }
      },
      y: {
        grid: { display: false, drawBorder: false },
        ticks: { color: 'rgba(255, 255, 255, 0.8)', font: { size: 13 } }
      }
    }
  };

  return (
    <div className="w-full border border-white/20 rounded-[32px] p-8 bg-black mt-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-1">Best Performing <span className="text-[#00CEC8]">Courses</span></h2>
        <p className="text-white/60 text-lg">Ranked by average mastery score</p>
      </div>
      <div className="h-[300px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BestPerformingCourse;