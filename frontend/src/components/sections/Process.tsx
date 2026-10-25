import { useEffect, useRef, useState } from 'react';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const useScrollFade = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.95);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpacity(1);
          setScale(1);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return { ref, opacity, scale };
};

const Process = () => {
  const { ref, opacity, scale } = useScrollFade();

  const steps: ProcessStep[] = [
    {
      number: '01',
      title: 'Discovery & Strategy',
      description: 'We deep-dive into your business goals, target audience, and competitive landscape. Our team crafts a strategic blueprint tailored to your unique needs.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Design & Prototyping',
      description: 'Our designers create refined, user-centric interfaces using industry best practices. We iterate through feedback to ensure pixel-perfect execution.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Development & Testing',
      description: 'Our engineers build robust, scalable solutions using modern technology stacks. Rigorous testing ensures quality, performance, and security.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Launch & Optimization',
      description: 'We deploy with precision, monitor performance, and continuously optimize. Our team provides ongoing support to maximize your ROI.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative w-full bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-exec-border-light dark:border-exec-border-dark">
      <div
        ref={ref}
        className="max-w-[1280px] mx-auto px-6 lg:px-8"
        style={{
          opacity,
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        {/* Section Header */}
        <div className="mb-16 lg:mb-20">
          <span className="font-mono text-[11px] text-blue-600 dark:text-[#3B82F6] tracking-[0.2em] font-semibold uppercase mb-4 inline-block">
            Our Methodology
          </span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-jakarta tracking-tight text-exec-navy dark:text-white mb-6 max-w-3xl">
            A Four-Phase Approach to
            <span className="text-blue-600 dark:text-[#2563EB] block">Digital Excellence</span>
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-exec-text-secondary max-w-2xl leading-relaxed">
            Our proven process combines strategic thinking, creative design, technical excellence, and continuous improvement to deliver results that exceed expectations.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-900/50 border border-exec-border-light dark:border-exec-border-dark rounded-xl p-8 transition-all duration-300 hover:shadow-exec-md dark:hover:shadow-exec-md hover:border-blue-400 dark:hover:border-blue-500/50"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Step Number */}
              <div className="mb-6">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center">
                  <span className="font-jakarta font-bold text-lg text-white">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Step Icon */}
              <div className="mb-4 text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity">
                {step.icon}
              </div>

              {/* Step Title */}
              <h3 className="font-jakarta font-semibold text-lg text-exec-navy dark:text-white mb-3">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-sm leading-relaxed text-slate-600 dark:text-exec-text-secondary">
                {step.description}
              </p>

              {/* Connecting Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-exec-border-light to-transparent dark:from-exec-border-dark"></div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Benefits Section */}
        <div className="mt-20 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-8">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">100%</div>
            <p className="text-sm font-jakarta font-semibold text-exec-navy dark:text-white mb-2">Client Satisfaction</p>
            <p className="text-sm text-slate-600 dark:text-exec-text-secondary">We measure success by your success and continuously optimize delivery.</p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/20 border border-exec-border-light dark:border-exec-border-dark rounded-xl p-8">
            <div className="text-3xl font-bold text-exec-slate dark:text-slate-300 mb-2">50+</div>
            <p className="text-sm font-jakarta font-semibold text-exec-navy dark:text-white mb-2">Successful Projects</p>
            <p className="text-sm text-slate-600 dark:text-exec-text-secondary">Proven track record across diverse industries and scales.</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-8">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">24/7</div>
            <p className="text-sm font-jakarta font-semibold text-exec-navy dark:text-white mb-2">Support Available</p>
            <p className="text-sm text-slate-600 dark:text-exec-text-secondary">Dedicated team ready to assist and scale with your needs.</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-jakarta font-semibold text-sm tracking-wide transition-all duration-200 active:scale-95 shadow-lg shadow-blue-600/30">
            Let's Start Your Project
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Process;
