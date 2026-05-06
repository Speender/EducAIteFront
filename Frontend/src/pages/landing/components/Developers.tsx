import { motion, useReducedMotion } from 'motion/react';

import Stack from './../../../components/Stack';
import { useImagePreload } from '../hooks/useImagePreload';

const developers = [
  {
    name: 'EducAIte Core Team',
    role: 'Product and Learning Systems',
    image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
  },
  {
    name: 'Frontend Experience',
    role: 'Student-facing Interactions',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
  },
  {
    name: 'AI Infrastructure',
    role: 'Analytics and Evaluation',
    image: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
  },
  {
    name: 'Platform Engineering',
    role: 'API and Data Reliability',
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format',
  },
];

function DeveloperFallbackGrid() {
  return (
    <div className="grid w-full max-w-[1180px] grid-cols-1 gap-6 px-6 md:grid-cols-2 xl:grid-cols-4">
      {developers.map((developer) => (
        <div key={developer.name} className="rounded-[28px] border border-white/10 bg-[#050505] p-6">
          <div className="mb-5 flex h-48 items-center justify-center rounded-[24px] border border-white/10 bg-white/5">
            <span className="text-4xl font-bold text-[#00CEC8]">{developer.name.charAt(0)}</span>
          </div>
          <p className="text-lg font-semibold text-white">{developer.name}</p>
          <p className="mt-2 text-sm text-white/60">{developer.role}</p>
        </div>
      ))}
    </div>
  );
}

const Developers = () => {
  const prefersReducedMotion = useReducedMotion();
  const imageState = useImagePreload(developers.map((developer) => developer.image));

  return (
    <div id="about" className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-transparent px-6 pb-[10vh] pt-[20vh] antialiased">
      <motion.div
        className="absolute left-0 top-0 z-30 rounded-br-[6vw] bg-black px-[10vw] pb-[6vh] pt-[12vh] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <h2 className="mb-4 text-[32px] font-bold leading-tight tracking-tighter md:text-[44px]">
          Meet the Innovators and Developers
        </h2>
        <p className="text-base font-medium leading-relaxed text-white/70 md:text-xl">
          Discover the brains and builders behind educ<span className="text-[#00CEC8]">AI</span>te.
        </p>
      </motion.div>

      {imageState.isLoading && !imageState.hasError && (
        <div className="relative z-20 mt-[10vh] h-[400px] w-[320px] rounded-[32px] border border-white/10 bg-white/5 animate-pulse md:h-[550px] md:w-[450px]" />
      )}

      {!imageState.isLoading && (imageState.hasError || prefersReducedMotion) && (
        <div className="relative z-20 mt-[10vh] w-full">
          <DeveloperFallbackGrid />
        </div>
      )}

      {!imageState.isLoading && !imageState.hasError && !prefersReducedMotion && (
        <div className="relative z-20 mt-[10vh] h-[400px] w-[320px] md:h-[550px] md:w-[450px]">
          <Stack
            randomRotation={false}
            sensitivity={200}
            sendToBackOnClick
            autoplay={false}
            autoplayDelay={3000}
            pauseOnHover={false}
            cards={developers.map((developer) => (
              <img
                key={developer.name}
                src={developer.image}
                alt={developer.name}
                className="pointer-events-none h-full w-full rounded-[32px] object-cover shadow-2xl"
              />
            ))}
          />
        </div>
      )}
    </div>
  );
};

export default Developers;
