import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import Search from './Search';

interface DashboardHeaderProps {
  studentFirstName: string;
  isLoading?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ studentFirstName, isLoading = false }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="mb-12 flex w-full flex-col items-center"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="mb-8 w-full max-w-[800px] text-center">
        <h1 className="mb-4 text-[3rem] font-bold leading-tight tracking-tight text-white md:text-[4rem]">
          Welcome back,{' '}
          <span className="text-[#00CEC8]">
            {isLoading ? (
              <span className="inline-flex min-w-[8rem] animate-pulse rounded-full bg-[#00CEC8]/12 px-5 py-2 text-[#7bf3ef]">
                Loading...
              </span>
            ) : (
              studentFirstName
            )}
          </span>
        </h1>
        <p className="text-lg font-medium text-white/70 md:text-xl">
          Your personalized AI dashboard tracks growth, progress, and the next best move.
        </p>
      </div>

      <Search />
    </motion.div>
  );
};

export default DashboardHeader;
