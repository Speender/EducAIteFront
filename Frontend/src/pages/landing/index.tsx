import { motion } from 'motion/react';

import RobotImage from '../../assets/robot.svg';
import EarthImage from '../../assets/earthbg.svg';
import LandingPageNavbar from '../../components/LandingPageNavbar';
import Developers from './components/Developers';
import FeatureCarousel from './components/FeatureCarousel';
import Footer from './components/Footer';
import LandingPageContent from './components/LandingPage';
import { useImagePreload } from './hooks/useImagePreload';

const LandingPage = () => {
  const heroAssets = useImagePreload([RobotImage, EarthImage]);

  if (heroAssets.isLoading && !heroAssets.hasError) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-black font-sans text-white antialiased">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 rounded-[32px] border border-white/10 bg-[#050505] px-10 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        >
          <div className="h-14 w-14 animate-spin rounded-full border-2 border-white/15 border-t-[#00CEC8]" />
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Preparing educ<span className="text-[#00CEC8]">AI</span>te
            </h1>
            <p className="text-sm text-white/60">Loading the launch experience and hero scene.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black font-sans text-white antialiased">
      <LandingPageNavbar />
      <div id="home" className="relative h-screen w-full overflow-hidden">
        <LandingPageContent />
      </div>
      <FeatureCarousel />
      <Developers />
      <Footer />
    </div>
  );
};

export default LandingPage;
