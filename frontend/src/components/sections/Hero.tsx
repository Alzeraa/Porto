import { useState, useEffect } from 'react';
import { useScrollFade } from '../../hooks/useScrollFade';
import { useThemeColors } from '../../hooks/useThemeColors';
import { smoothScrollTo } from '../../utils/scroll';
import { API_ENDPOINTS } from '../../config/api';

interface ProfileData {
  name: string;
  badge: string;
  title: string;
  subtitle: string;
  bio?: string;
  whatsapp?: string;
  logo_url?: string;
  cta_primary_text?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
  trusted_by_title?: string;
  tech_stack_title?: string;
  tech_stack?: string;
}

const defaultProfile: ProfileData = {
  name: 'Alvaeryn',
  badge: 'Jasa Pembuatan Website & Aplikasi Profesional',
  title: 'Bangun Website & Aplikasi Yang Memukau',
  subtitle: 'Alvaeryn siap membantu kamu buat website, landing page, dan aplikasi mobile modern—cepat, responsif, dan profesional!',
  logo_url: '/Final-Logo.png',
  cta_primary_text: 'Konsultasi Gratis Sekarang',
  cta_primary_link: '#contact',
  cta_secondary_text: 'Lihat Proyek Kami',
  cta_secondary_link: '#projects',
  trusted_by_title: 'Dipercaya oleh Startup & UMKM Mapan',
  tech_stack_title: 'Teknologi yang Kami Gunakan',
  tech_stack: 'React, Next.js, TypeScript, JavaScript, Flutter, Node.js, Express, MySQL, PHP, Laravel, Tailwind, Figma',
};

const techIconMap: Record<string, string> = {
  'React': 'devicon-react-original colored',
  'Next.js': 'devicon-nextjs-original colored',
  'TypeScript': 'devicon-typescript-plain colored',
  'JavaScript': 'devicon-javascript-plain colored',
  'Flutter': 'devicon-flutter-plain colored',
  'Node.js': 'devicon-nodejs-plain colored',
  'Express': 'devicon-express-original colored',
  'MySQL': 'devicon-mysql-original colored',
  'PHP': 'devicon-php-plain colored',
  'Laravel': 'devicon-laravel-plain colored',
  'Tailwind': 'devicon-tailwindcss-original colored',
  'Figma': 'devicon-figma-plain colored',
  'Python': 'devicon-python-plain colored',
  'Go': 'devicon-go-original-wordmark colored',
  'Docker': 'devicon-docker-plain colored',
  'PostgreSQL': 'devicon-postgresql-plain colored',
  'MongoDB': 'devicon-mongodb-plain colored',
  'Vue': 'devicon-vuejs-plain colored',
};

const Hero = () => {
  const { ref, opacity, scale } = useScrollFade();
  const { theme } = useThemeColors();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    fetch(API_ENDPOINTS.profile)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data && res.data.title) {
          setProfile((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => console.log('Menggunakan data bawaan', err));
  }, []);

  const techList = (profile.tech_stack || defaultProfile.tech_stack || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 pt-32 pb-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ backgroundColor: theme.primary_light }}></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ backgroundColor: theme.accent_color }}></div>
      </div>

      <div 
        ref={ref}
        className="max-w-5xl mx-auto px-6 text-center animate-on-load relative z-10"
        style={{ 
          opacity, 
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        {/* Dynamic Logo */}
        <div className="mb-6">
          <img 
            src={profile.logo_url || '/Final-Logo.png'} 
            alt={`${profile.name} Logo`} 
            className="h-32 w-32 mx-auto mb-4 object-contain rounded-full bg-white/10 p-1.5 shadow-md transition-transform duration-300 hover:scale-105" 
            style={{ boxShadow: `0 0 20px ${theme.accent_color}40` }}
          />
        </div>
        
        {/* Dynamic Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full shadow-sm border" style={{ borderColor: theme.accent_color + '40' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent_color }}></span>
          <span className="text-xs font-semibold text-gray-300">
            {profile.badge || defaultProfile.badge}
          </span>
        </div>

        {/* Dynamic Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          <span style={{ backgroundImage: `linear-gradient(to right, ${theme.primary_light}, ${theme.accent_color})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {profile.title || defaultProfile.title}
          </span>
        </h1>

        {/* Dynamic Subtitle */}
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-10">
          {profile.subtitle || defaultProfile.subtitle}
        </p>

        {/* Dynamic CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo(profile.cta_primary_link || '#contact');
            }}
            className="px-8 py-3 text-white rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all"
            style={{ 
              background: `linear-gradient(to right, ${theme.primary_color}, ${theme.primary_light})`,
              boxShadow: `0 0 20px ${theme.primary_light}40`
            }}
          >
            {profile.cta_primary_text || defaultProfile.cta_primary_text}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo(profile.cta_secondary_link || '#projects');
            }}
            className="px-8 py-3 text-white rounded-full font-bold text-sm hover:scale-105 transition-all border"
            style={{ 
              borderColor: theme.accent_color,
              color: theme.accent_color
            }}
          >
            {profile.cta_secondary_text || defaultProfile.cta_secondary_text}
          </button>
        </div>

        {/* Trusted By Section */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            {profile.trusted_by_title || defaultProfile.trusted_by_title}
          </p>
          <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap mb-6">
            {[
              { icon: 'devicon-amazonwebservices-plain-wordmark' },
              { icon: 'fab fa-stripe' },
              { icon: 'fab fa-google-pay' },
              { icon: 'devicon-apple-original' },
              { icon: 'devicon-android-plain' }
            ].map((brand, i) => (
              <div key={i} className="text-3xl text-gray-600 hover:opacity-100 opacity-50 transition-all duration-300">
                <i className={brand.icon} style={{ fontSize: '1.75rem' }}></i>
              </div>
            ))}
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

          {/* Scroll Indicator */}
          <div className="mt-8 mb-8 flex justify-center">
            <div className="w-7 h-12 border-2 border-gray-600 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-2.5 rounded-full animate-scroll-bounce" style={{ backgroundColor: theme.accent_color }}></div>
            </div>
          </div>
        </div>

        {/* Dynamic Teknologi yang Kami Gunakan */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
          {profile.tech_stack_title || defaultProfile.tech_stack_title}
        </p>

        {/* Dynamic Tech Stack List */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {techList.map((techName, i) => {
            const iconClass = techIconMap[techName] || 'fas fa-code text-cyan-500';
            return (
              <div key={i} className="flex items-center gap-2 hover:-translate-y-1 transition-all cursor-pointer group">
                <i className={`${iconClass}`} style={{ fontSize: '1.25rem', color: theme.accent_color }}></i>
                <span className="font-semibold text-gray-400 text-sm group-hover:text-white transition-colors">
                  {techName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
