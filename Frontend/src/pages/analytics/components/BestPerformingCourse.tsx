import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const BestPerformingCourse = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        backgroundColor: ['#2563eb', '#ec4899', '#eab308', '#22c55e'],
        
        borderRadius: isMobile ? 6 : 15,
        barThickness: isMobile ? 20 : 40,
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y' as const, 
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
        ticks: { 
          color: 'rgba(255, 255, 255, 0.5)', 
          stepSize: 25,
          font: { size: isMobile ? 10 : 12 } 
        }
      },
      y: {
        grid: { display: false, drawBorder: false },
        ticks: { 
          color: 'rgba(255, 255, 255, 0.8)', 
          font: { size: isMobile ? 10 : 13 } 
        }
      }
    }
  };

  return (
    <div className="w-full border border-white/20 rounded-2xl md:rounded-[32px] p-4 md:p-8 bg-black mt-6 md:mt-8 group hover:border-[#00CEC8]/60 hover:shadow-[0_0_30px_rgba(0,206,200,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold mb-1">
          Best Performing <span className="text-[#00CEC8]">Courses</span>
        </h2>
        <p className="text-white/60 group-hover:text-white/80 transition-colors text-xs md:text-lg">
          Ranked by average mastery score
        </p>
      </div>
      
      <div className="h-[200px] md:h-[300px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BestPerformingCourse;