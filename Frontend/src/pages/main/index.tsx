import React from 'react';

import EarthBg from '../../assets/earthbg.svg';
import Logo from '../../components/Logo';
import robotImg from '../../assets/robot.svg';
import { useStudentDashboardQuery } from '@/features/dashboard/api/hooks';
import { getAuthSession } from '@/lib/api/auth';

import BentoCards from './components/BentoCards';
import DashboardHeader from './components/DashboardHeader';

const MainPage: React.FC = () => {
  const session = getAuthSession();
  const dashboardQuery = useStudentDashboardQuery();

  const studentFirstName =
    dashboardQuery.data?.student.firstName ??
    session?.student.firstName ??
    'Student';

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black pb-20 font-sans text-white antialiased">
      <Logo />

      <main className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center px-6 pt-32">
        <DashboardHeader
          studentFirstName={studentFirstName}
          isLoading={dashboardQuery.isPending}
        />
        <BentoCards
          dashboard={dashboardQuery.data}
          error={dashboardQuery.error}
          isError={dashboardQuery.isError}
          isLoading={dashboardQuery.isPending}
          onRetry={() => void dashboardQuery.refetch()}
        />
      </main>

      <img
        src={robotImg}
        alt="AI Robot avatar"
        className="pointer-events-none absolute bottom-20 right-10 z-40 h-auto w-[140px] scale-x-[-1] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-[float_3s_ease-in-out_infinite]"
      />

      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[60%] w-full">
        <img
          src={EarthBg}
          alt=""
          className="h-full w-full object-cover opacity-40"
          style={{ maskImage: 'linear-gradient(to top, black, transparent)' }}
        />
      </div>
    </div>
  );
};

export default MainPage;
