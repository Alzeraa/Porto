import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useScrollFade } from '../../hooks/useScrollFade';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useLanguage } from '../../hooks/useLanguage';
import { API_ENDPOINTS } from '../../config/api';

interface Package {
  id?: number;
  name: string;
  price: string;
  popular: boolean;
  features: string[];
}

const defaultPackages: Package[] = [
  {
    name: 'Landing Page',
    price: 'Rp 399K',
    popular: false,
    features: ['Responsive Design', '5-7 Sections', 'Contact Form', 'Basic SEO', '7 Hari Pengerjaan']
  },
  {
    name: 'Business Website',
    price: 'Rp 1,2JT',
    popular: true,
    features: ['Multi Page (Max 8)', 'Premium UI/UX', 'SEO Optimization', 'Admin CMS', '14 Hari Pengerjaan', '30 Hari Support', 'Free Domain 1 Tahun']
  },
  {
    name: 'Full-Stack App',
    price: 'Rp 3JT+',
    popular: false,
    features: ['Full-Stack Development', 'Custom Features', 'Database Integration', 'API Development', '21-30 Hari Pengerjaan', 'Full Source Code']
  }
];

const PackageCard = ({ pkg, index, theme, t }: { pkg: Package; index: number; theme: any; t: any }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  
  const animations = ['animate-fade-left', 'animate-scale-up', 'animate-fade-right'];
  const animationClass = animations[index % animations.length];
  
  return (
    <div 
      ref={ref}
      className={`p-8 rounded-2xl border-2 bg-white dark:bg-slate-800 transition-all animate-on-scroll ${animationClass} ${isVisible ? 'visible' : ''}`}
      style={{
        borderColor: pkg.popular ? theme.primary_light : theme.accent_color + '40',
        transform: pkg.popular ? 'scale(1.05)' : 'scale(1)',
        boxShadow: pkg.popular ? `0 25px 50px -12px ${theme.primary_light}40` : 'none'
      }}
    >
      {pkg.popular && (
        <span className="inline-block text-white px-4 py-1 rounded-full text-sm font-semibold mb-4" style={{ background: `linear-gradient(to right, ${theme.primary_light}, ${theme.accent_color})` }}>{t('pricing.popular')}</span>
      )}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{pkg.name}</h3>
      <p className="text-4xl font-bold mb-6" style={{ color: theme.primary_light }}>{pkg.price}</p>
      <ul className="space-y-3 mb-8">
        {pkg.features && pkg.features.map((feature, j) => (
          <li key={j} className="flex items-center text-slate-700 dark:text-slate-300">
            <span className="mr-3 text-lg" style={{ color: theme.accent_color }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <a href="#contact" className="block text-center py-3 px-6 rounded-full font-semibold transition-all text-white"
        style={{
          background: pkg.popular 
            ? `linear-gradient(to right, ${theme.primary_light}, ${theme.accent_color})`
            : theme.primary_color,
          boxShadow: `0 0 20px ${theme.primary_light}40`
        }}
      >
        {t('pricing.order_now')}
      </a>
    </div>
  );
};

const Pricing = () => {
  const [packages, setPackages] = useState<Package[]>(defaultPackages);
  const { theme } = useThemeColors();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(API_ENDPOINTS.pricing)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
          setPackages(res.data);
        }
      })
      .catch((err) => console.log('Using default pricing', err));
  }, []);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.3);
  const { ref: contentRef, opacity, scale } = useScrollFade();

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div 
        ref={contentRef} 
        className="max-w-6xl mx-auto px-6"
        style={{ 
          opacity, 
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        <div ref={headerRef} className={`text-center mb-16 animate-on-scroll animate-bounce ${headerVisible ? 'visible' : ''}`}>
          <p className="font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accent_color }}>{t('pricing.label')}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">{t('pricing.title')}</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id || i} pkg={pkg} index={i} theme={theme} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
