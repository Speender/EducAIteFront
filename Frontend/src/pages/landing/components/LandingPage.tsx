import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';

import AtomIcon from '../../../assets/lg-atom.svg';
import BeakersIcon from '../../../assets/lg-chemist.svg';
import BooksIcon from '../../../assets/lg-books.svg';
import CalculatorIcon from '../../../assets/lg-calculator.svg';
import CalendarIcon from '../../../assets/lg-calendar.svg';
import GraduationCapIcon from '../../../assets/lg-gradhat.svg';
import LaptopIcon from '../../../assets/lg-laptop.svg';
import LightbulbIcon from '../../../assets/lg-lightbulb.svg';
import EarthImage from '../../../assets/earthbg.svg';
import RobotImage from '../../../assets/robot.svg';

const heroIcons = [
  { src: LightbulbIcon, alt: 'Lightbulb', className: 'top-[23vh] left-[5vw] w-[92px] md:w-[120px] lg:w-[140px]', delay: 0.1 },
  { src: BooksIcon, alt: 'Books', className: 'top-[34vh] left-[22vw] hidden w-[90px] md:block lg:w-[100px]', delay: 0.16 },
  { src: CalculatorIcon, alt: 'Calculator', className: 'top-[48vh] left-[12vw] w-[84px] md:w-[100px] lg:w-[110px]', delay: 0.22 },
  { src: BeakersIcon, alt: 'Beakers', className: 'bottom-[22vh] left-[7vw] w-[72px] md:w-[82px] lg:w-[90px]', delay: 0.28 },
  { src: GraduationCapIcon, alt: 'Graduation Cap', className: 'top-[22vh] right-[4vw] w-[118px] md:w-[160px] lg:w-[200px]', delay: 0.1 },
  { src: CalendarIcon, alt: 'Calendar', className: 'top-[42vh] right-[22vw] hidden w-[78px] md:block lg:w-[90px]', delay: 0.18 },
  { src: AtomIcon, alt: 'Atom', className: 'bottom-[32vh] right-[24vw] hidden w-[82px] md:block lg:w-[100px]', delay: 0.24 },
  { src: LaptopIcon, alt: 'Laptop', className: 'bottom-[24vh] right-[7vw] w-[98px] md:w-[118px] lg:w-[130px]', delay: 0.3 },
];

const LandingPageContent = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,206,200,0.14),_transparent_32%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.08),_transparent_30%)]" />

      <motion.div
        className="pointer-events-none absolute left-0 top-[12vh] z-50 flex w-full flex-col items-center px-6 text-center md:px-10"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <h1 className="max-w-5xl text-[42px] font-bold tracking-tight text-white md:text-[56px] md:leading-tight">
          Empower your learning with <span className="text-[#00CEC8]">AI</span>
        </h1>
        <p className="mt-4 max-w-3xl text-base font-medium text-white/80 md:text-lg">
          Transform notes into study systems, track progress with real analytics, and move through every semester with focused AI support.
        </p>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 h-full w-full">
        <motion.div
          className="absolute bottom-[16vh] left-1/2 z-20 w-[240px] -translate-x-1/2 md:w-[320px] lg:w-[420px]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 36, scale: 0.96 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 1, y: [0, -10, 0], scale: 1 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.5 }
              : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <img
            src={RobotImage}
            alt="AI Robot"
            className="h-auto w-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </motion.div>

        <div className="absolute bottom-0 left-0 z-30 h-[44vh] w-full md:h-[52vh] lg:h-[55vh]">
          <img
            src={EarthImage}
            alt=""
            className="h-full w-full object-cover object-top opacity-85"
          />
        </div>

        {heroIcons.map((icon) => (
          <motion.img
            key={icon.alt}
            src={icon.src}
            alt={icon.alt}
            className={`absolute z-20 drop-shadow-2xl ${icon.className}`}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, y: 14 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 1, scale: 1, y: [0, -8, 0] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.35, delay: icon.delay }
                : { duration: 4 + icon.delay, delay: icon.delay, ease: 'easeInOut', repeat: Infinity }
            }
          />
        ))}
      </div>

      <motion.div
        className="absolute bottom-[7vh] left-1/2 z-50 flex w-full max-w-[320px] -translate-x-1/2 flex-col items-center gap-3 px-6"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
      >
        <button
          onClick={() => navigate('/login')}
          className="pointer-events-auto w-full rounded-full bg-white py-3.5 text-[15px] font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEC8]/60"
        >
          Login
        </button>

        <button
          onClick={() => navigate('/register')}
          className="pointer-events-auto w-full rounded-full border border-white/20 bg-black py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEC8]/60"
        >
          Register
        </button>
      </motion.div>
    </>
  );
};

export default LandingPageContent;
