import { useState, useEffect } from 'react';
import { useScrollFade } from '../../hooks/useScrollFade';
import { useLanguage } from '../../hooks/useLanguage';
import { smoothScrollTo } from '../../utils/scroll';
import { API_ENDPOINTS } from '../../config/api';

interface ProfileData {
  name: string;
  badge: string;
  title: string;
  subtitle: string;
  bio?: string;
  whatsapp?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  logo_url?: string;
  cta_primary_text?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
  trusted_by_title?: string;
  tech_stack_title?: string;
  tech_stack?: string;
}

interface HeroCard {
  id: number;
  title: string;
  image: string;
  description?: string;
  order_index: number;
}

const defaultProfile: ProfileData = {
  name: 'ALZERA',
  badge: 'Jasa Pembuatan Website & Aplikasi Profesional',
  title: 'Bangun Website & Aplikasi Yang Memukau',
  subtitle: 'ALZERA siap membantu kamu buat website, landing page, dan aplikasi mobile modern—cepat, responsif, dan profesional!',
  bio: 'Digital agency & software engineering studio',
  whatsapp: '081234567890',
  email: 'admin@gmail.com',
  github: 'https://github.com/ALZERA',
  linkedin: 'https://linkedin.com',
  logo_url: '/Final-Logo.png',
  cta_primary_text: 'Konsultasi Gratis Sekarang',
  cta_primary_link: '#contact',
  cta_secondary_text: 'Lihat Proyek Kami',
  cta_secondary_link: '#projects',
  trusted_by_title: 'Dipercaya oleh Startup & UMKM Mapan',
  tech_stack_title: 'Teknologi yang Kami Gunakan',
  tech_stack: 'React, Next.js, TypeScript, JavaScript, Flutter, Node.js, Express, MySQL, PHP, Laravel, Tailwind, Figma'
};

const Hero = () => {
  const { ref, opacity, scale } = useScrollFade();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [heroCards, setHeroCards] = useState<HeroCard[]>([]);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch profile
    fetch(API_ENDPOINTS.profile)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data && res.data.title) {
          setProfile((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => console.log('Using default profile', err));

    // Fetch hero cards from API
    fetch(API_ENDPOINTS.heroCards)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && Array.isArray(res.data)) {
          setHeroCards(res.data);
        }
      })
      .catch((err) => console.log('Error fetching hero cards', err));
  }, []);



  return (
    <section id="home" className="relative w-full bg-[#080D1D] pt-16 pb-20 lg:pt-20 lg:pb-28 border-b border-[#1E293B]/60 overflow-hidden">
      {/* Subtle Blueprint Vertical Guidelines */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 absolute inset-0 pointer-events-none hidden md:block">
        <div className="w-full h-full relative">
          <div className="absolute left-[58%] top-0 bottom-0 w-[1px] bg-[#1E293B]/40"></div>
          <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-[#1E293B]/40"></div>
        </div>
      </div>

      <div
        ref={ref}
        className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10"
        style={{
          opacity,
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          {/* Left Editorial Content Column */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Monospace Badge */}
            <span className="font-mono text-[11px] text-blue-500 tracking-[0.2em] font-semibold uppercase mb-6">
              {profile.badge || t('hero.badge')}
            </span>

            {/* Main Headline */}
            <h1 className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-[70px] tracking-tight text-white leading-[1.08] mb-6">
              {profile.title || t('hero.title')}
            </h1>

            {/* Subtitle Description */}
            <p className="font-body text-base sm:text-[17px] text-[#8E9DB5] leading-relaxed max-w-lg mb-9">
              {profile.subtitle || t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-5 w-full sm:w-auto">
              {/* Primary CTA Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(profile.cta_primary_link || '#contact');
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold tracking-wider transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/25"
              >
                <span>{profile.cta_primary_text || t('hero.cta_primary')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Secondary CTA Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(profile.cta_secondary_link || '#projects');
                }}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-transparent hover:bg-white/5 text-white font-sans text-xs font-semibold tracking-wide transition-all duration-150"
              >
                <span className="text-[#B8C4D9] hover:text-white">
                  {profile.cta_secondary_text || t('hero.cta_secondary')}
                </span>
                <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Right Visual Hero Graphic - Card Stack */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end h-[500px] sm:h-[560px] perspective">
            {/* Faceted 3D 'A' Prism Structure Background */}
            <div className="absolute -right-4 top-0 bottom-0 w-[450px] sm:w-[500px] h-full pointer-events-none select-none z-0">
              <svg viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                <defs>
                  <linearGradient id="prismApex" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6"></stop>
                    <stop offset="100%" stopColor="#1D4ED8"></stop>
                  </linearGradient>
                  <linearGradient id="prismLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E40AF"></stop>
                    <stop offset="100%" stopColor="#0F2766"></stop>
                  </linearGradient>
                  <linearGradient id="prismRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB"></stop>
                    <stop offset="100%" stopColor="#1D4ED8"></stop>
                  </linearGradient>
                </defs>
                <polygon points="120,560 210,120 280,120 480,560 380,560 250,270 180,560" fill="url(#prismLeft)" opacity="0.6"></polygon>
                <polygon points="210,120 310,10 460,350 380,350 280,120" fill="url(#prismRight)"></polygon>
                <polygon points="130,280 210,120 280,120 200,320" fill="url(#prismLeft)"></polygon>
                <polygon points="210,120 310,10 270,10 190,120" fill="url(#prismApex)"></polygon>
                <polygon points="280,120 490,560 390,560 240,240" fill="url(#prismRight)"></polygon>
              </svg>
            </div>

            {/* Card Stack Container */}
            <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1200px' }}>
              {heroCards.length > 0 ? (
                heroCards.map((card, index) => {
                  const isActive = activeCardId === card.id;
                  
                  // Calculate position based on index
                  let transform = '';
                  let zIndex = 20;
                  
                  if (activeCardId === null) {
                    // Default stacking - ALL cards visible
                    if (index === 0) {
                      transform = 'translate(-96px, 48px) rotate(-6deg) scale(0.95)';
                      zIndex = 10;
                    } else if (index === 1) {
                      transform = 'translate(0, 0) rotate(0deg) scale(1)';
                      zIndex = 20;
                    } else if (index === 2) {
                      transform = 'translate(96px, 48px) rotate(6deg) scale(0.95)';
                      zIndex = 15;
                    } else {
                      transform = `translate(0, ${64 + (index - 2) * 32}px) scale(${1 - (index - 2) * 0.05})`;
                      zIndex = 20 - (index - 2);
                    }
                  } else if (isActive) {
                    // Active card - centered, front
                    transform = 'translate(0, 0) rotate(0deg) scale(1)';
                    zIndex = 30;
                  } else {
                    // Inactive cards - pushed back
                    if (index === 0) {
                      transform = 'translate(-128px, 80px) rotate(-8deg) scale(0.9)';
                      zIndex = 5;
                    } else if (index === 1) {
                      transform = 'translate(128px, 80px) rotate(8deg) scale(0.9)';
                      zIndex = 5;
                    } else {
                      transform = 'translate(-64px, 112px) rotate(-4deg) scale(0.88)';
                      zIndex = 3;
                    }
                  }
                  
                  return (
                    <div
                      key={card.id}
                      onClick={() => setActiveCardId(isActive ? null : card.id)}
                      className="absolute w-[280px] h-[340px] rounded-xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-3xl"
                      style={{
                        transform,
                        zIndex,
                        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    >
                      {/* Image */}
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                      />
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-slate-400">Loading cards...</div>
              )}
            </div>

            {/* Vertical Index Counter */}
            <div className="hidden lg:flex absolute -right-6 top-1/3 flex-col items-center gap-2 select-none pointer-events-none z-10">
              <span className="font-mono text-[10px] text-[#64748B] tracking-widest -rotate-90 origin-center whitespace-nowrap">
                0{activeCardId && heroCards.length > 0 ? heroCards.findIndex(c => c.id === activeCardId) + 1 : heroCards.length > 1 ? 2 : 1} / 0{heroCards.length || 3}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
