import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const LearningTrendAnalysis = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Hours Studied',
        data: [12, 19, 15, 22, 18, 25],
        backgroundColor: '#00CEC8', 
        
        barThickness: isMobile ? 20 : 150,
        
        borderRadius: isMobile ? 4 : 25, 
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
        ticks: { 
          color: 'rgba(255, 255, 255, 0.5)',
          font: { size: isMobile ? 10 : 12 }
        }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { 
          color: 'rgba(255, 255, 255, 0.5)',
          font: { size: isMobile ? 10 : 12 }
        }
      }
    }
  };

  return (
    <div className="w-full border border-white/20 rounded-2xl md:rounded-[32px] p-4 md:p-8 bg-black mt-6 md:mt-8 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_30px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold mb-1">
          Learning <span className="text-[#00CEC8]">Trend Analysis</span>
        </h2>
        <p className="text-white/60 group-hover:text-white/80 transition-colors text-xs md:text-lg">
          Hours studied over the last 6 weeks
        </p>
      </div>

      <div className="h-[150px] md:h-[300px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default LearningTrendAnalysis;