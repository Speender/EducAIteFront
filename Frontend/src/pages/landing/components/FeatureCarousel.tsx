import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, type PanInfo } from 'framer-motion';

const featureCards = [
  {
    title: 'AI Flashcards',
    eyebrow: 'Recall Engine',
    description: 'Generate decks from real class material and evaluate answers with context-aware grading instead of brittle exact matches.',
    accent: 'bg-[linear-gradient(160deg,rgba(0,206,200,0.24),rgba(0,206,200,0.05)_55%,rgba(255,255,255,0.04))]',
  },
  {
    title: 'Progress Analytics',
    eyebrow: 'Student Signals',
    description: 'Track retention, confidence, and overall performance through dashboards that reflect actual study patterns and course progress.',
    accent: 'bg-[linear-gradient(160deg,rgba(74,103,146,0.34),rgba(74,103,146,0.08)_55%,rgba(255,255,255,0.04))]',
  },
  {
    title: 'Study Load Workspace',
    eyebrow: 'Course Flow',
    description: 'Group courses by year and semester so your notes, flashcards, and review sessions stay organized around the term you are in.',
    accent: 'bg-[linear-gradient(160deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05)_55%,rgba(0,206,200,0.08))]',
  },
  {
    title: 'Actionable AI Guidance',
    eyebrow: 'Next Step Clarity',
    description: 'Surface concrete improvement suggestions after every answer and summary refresh so students know what to review next.',
    accent: 'bg-[linear-gradient(160deg,rgba(251,191,36,0.2),rgba(251,191,36,0.05)_55%,rgba(255,255,255,0.04))]',
  },
];

const FeatureCarousel = () => {
  useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const AUTO_PLAY_INTERVAL = 4000;

  // Track resizing
  useEffect(() => {
    const updateWidth = () => {
      if (viewportRef.current) setViewportWidth(viewportRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featureCards.length);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const { cardWidth, gap, trackX } = useMemo(() => {
    const width = viewportWidth || 1200;
    // LARGE CARDS: 85% of screen on mobile, capped at 800px on desktop
    const resolvedCardWidth = width < 768 ? width * 0.85 : Math.min(width * 0.6, 800);
    const resolvedGap = 40;

    // THE MATH FOR EVEN CENTERING:
    // (Half of screen) - (Half of the card) - (All cards before it + their gaps)
    const centerOffset = width / 2 - resolvedCardWidth / 2;
    const calculatedX = centerOffset - activeIndex * (resolvedCardWidth + resolvedGap);

    return {
      cardWidth: resolvedCardWidth,
      gap: resolvedGap,
      trackX: calculatedX,
    };
  }, [activeIndex, viewportWidth]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const dragThreshold = 50;
    if (info.offset.x < -dragThreshold && activeIndex < featureCards.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (info.offset.x > dragThreshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <section id="features" className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-black antialiased">
      
      {/* LEFT-SIDE TITLE (Matching Developers Layout) */}
      <motion.div 
        className="absolute left-0 top-0 z-30 px-[10vw] pb-[6vh] pt-[7vh]"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-[32px] font-bold leading-tight tracking-tighter text-white md:text-[52px]">
          Get to know Educ<span className="text-[#00CEC8]">AI</span>te
        </h2>
        <p className="mt-2 text-base font-medium text-white/50 md:text-xl">
          Powerful tools designed for the modern student.
        </p>
      </motion.div>

      {/* CAROUSEL TRACK */}
      <div ref={viewportRef} className="relative z-10 w-full pt-[20vh]">
        <motion.div
          drag="x"
          dragConstraints={{ left: trackX, right: trackX }}
          animate={{ x: trackX }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          onDragEnd={handleDragEnd}
          className="flex cursor-grab active:cursor-grabbing"
          style={{ gap: `${gap}px` }}
        >
          {featureCards.map((feature, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.article
                key={feature.title}
                animate={{
                  scale: isActive ? 1 : 0.85,
                  opacity: isActive ? 1 : 0.3,
                  y: isActive ? 0 : 20
                }}
                transition={{ duration: 0.4 }}
                className={`relative flex min-h-[550px] flex-shrink-0 flex-col rounded-[48px] border border-white/10 p-10 shadow-2xl backdrop-blur-md md:min-h-[650px] ${feature.accent}`}
                style={{ width: `${cardWidth}px` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00CEC8]">
                      {feature.eyebrow}
                    </p>
                    <h3 className="mt-4 text-4xl font-bold text-white md:text-6xl">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="text-6xl font-black text-white/5">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                <div className="mt-10 flex-grow rounded-[32px] border border-white/5 bg-black/40">
                    {/* Placeholder for Graphic/UI */}
                    <div className="h-full w-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00CEC8]/20 to-transparent" />
                </div>

                <p className="mt-8 text-lg leading-relaxed text-white/70 md:text-2xl">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>

        {/* INDICATORS */}
        <div className="mt-12 flex justify-center gap-3">
          {featureCards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-12 bg-[#00CEC8]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCarousel;
