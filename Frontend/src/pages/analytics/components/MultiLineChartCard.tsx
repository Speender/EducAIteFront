import React, { useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface Props {
  titleHighlight: string;
  titleRest: string;
  subtitleLabel: string;
  subtitleValue: string;
}

const MultiLineChartCard = ({ titleHighlight, titleRest, subtitleLabel, subtitleValue }: Props) => {
  // State for the dropdown toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State for the selected dropdown text (defaults to the passed props)
  const [selectedSubject, setSelectedSubject] = useState(`${titleHighlight} ${titleRest}`);

  // Ref for the "click outside to close" feature
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownOptions = [
    "Database Management System",
    "Human Computer Interaction",
    "Artificial Intelligence",
    "Emerging Technologies",
    "Research Communications",
    "Android Programming"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- CHART.JS CONFIGURATION ---
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Human Computer Interaction',
        data: [20, 35, 25, 60, 40, 80, 90],
        borderColor: '#2563eb',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Freetrnds',
        data: [10, 25, 15, 40, 30, 70, 85],
        borderColor: '#ec4899',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Proglan',
        data: [40, 55, 45, 80, 60, 95, 100],
        borderColor: '#eab308',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Comprog 11',
        data: [15, 30, 20, 50, 35, 75, 80],
        borderColor: '#22c55e',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Eldroid',
        data: [5, 15, 10, 30, 20, 50, 60],
        borderColor: '#ef4444',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'FreeAI',
        data: [10, 10, 40, 45, 30, 60, 65],
        borderColor: '#ffffff',
        borderWidth: 3,
        borderDash: [10, 10], 
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ]
  };

  // Using 'any' here bypasses the strict Chart.js type checking 
  // which prevents those frustrating red lines in your editor.
  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        titleColor: '#00CEC8',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          display: false, 
        },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          display: false, 
        },
        border: {
          dash: [5, 5] 
        },
        ticks: {
          stepSize: 25,
          color: 'rgba(255, 255, 255, 0.5)',
          padding: 10,
        }
      }
    }
  };

  return (
    <div className="w-full border border-white/20 rounded-[32px] p-8 bg-black mt-8">
      {/* Header & Dropdown */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1"><span className="text-[#00CEC8]">{titleHighlight}</span> {titleRest}</h2>
          <div className="flex items-center gap-4">
            <p className="text-white/60 text-lg">{subtitleLabel} <span className="text-white font-bold ml-1">{subtitleValue}</span></p>
            <span className="text-[#22c55e] text-xs">↑ +4% this week</span>
          </div>
        </div>
        
        {/* Dropdown Logic with Ref for clicking outside */}
        <div className="relative z-50" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="border border-white/20 rounded-xl px-4 py-3 flex items-center gap-6 bg-black cursor-pointer hover:bg-white/5 transition min-w-[260px] justify-between"
          >
            <span className="text-sm font-medium">{selectedSubject}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
          </div>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-full bg-black border border-white/20 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden">
              <ul className="flex flex-col">
                {dropdownOptions.map((option, index) => (
                  <li key={index} onClick={() => { setSelectedSubject(option); setIsDropdownOpen(false); }} className={`px-5 py-4 text-sm font-medium text-white cursor-pointer hover:bg-white/10 hover:text-[#00CEC8] transition-colors ${index !== dropdownOptions.length - 1 ? 'border-b border-white/20' : ''}`}>
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Custom HTML Legend */}
      <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm font-medium">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#2563eb]"></div>Human Computer Interaction</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#ec4899]"></div>Freetrnds</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#eab308]"></div>Proglan</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>Comprog 11</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>Eldroid</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white"></div>FreeAI</div>
      </div>

      {/* Chart.js Rendering Area */}
      <div className="relative h-[400px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* AI Insight */}
      <div className="bg-[#005e5d] rounded-2xl p-6 mt-12 flex items-center gap-4">
        <span className="font-bold text-white text-lg whitespace-nowrap">AI Insight:</span>
        <span className="text-white/90 text-sm">Your learning improves when you study consistently 1.8-2.3 hours per day. Continue your routine to maintain strong progress.</span>
      </div>
    </div>
  );
};

export default MultiLineChartCard;