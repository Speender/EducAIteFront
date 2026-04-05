import React from 'react';
import EarthBg from '../../assets/earthbg.svg';
import robotImg from '../../assets/robot.svg';
import Logo from '../../components/Logo';

import DashboardHeader from './components/DashboardHeader';
import BentoCards from './components/BentoCards';


const MainPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden antialiased pb-20">

            <Logo />

            {/* 2. Main Content Container */}
            <main className="max-w-[1280px] mx-auto px-6 pt-32 relative z-10 flex flex-col items-center">

                {/* Top Section: Text and Search */}
                <DashboardHeader />

                {/* Bottom Section: The 3-Column Bento Grid */}
                <BentoCards />

            </main>

            {/* 3. Floating Robot (Bottom Right) */}
            <img
                src={robotImg}
                alt="AI Robot avatar"
                className="absolute bottom-20 right-10 w-[140px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 pointer-events-none transform scale-x-[-1] animate-[float_3s_ease-in-out_infinite]"
            />

            {/* 4. Earth Background */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] z-0 pointer-events-none">
                <img
                    src={EarthBg}
                    alt=""
                    className="w-full h-full object-cover opacity-40"
                    style={{ maskImage: 'linear-gradient(to top, black, transparent)' }}
                />
            </div>

        </div>
    );
};

export default MainPage;