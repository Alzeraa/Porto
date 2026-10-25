import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScrollFade } from '../hooks/useScrollFade';
import { useThemeColors } from '../hooks/useThemeColors';
import { useLanguage } from '../hooks/useLanguage';
import { API_ENDPOINTS } from '../config/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface Service {
  id?: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const getDefaultServices = (t: any): Service[] => [
  {
    icon: '🌐',
    title: t('services.web_development'),
    description: t('services.web_development_desc'),
    features: [t('services.features.responsive'), t('services.features.seo'), t('services.features.fast_loading')]
  },
  {
    icon: '📱',
    title: t('services.mobile_app'),
    description: t('services.mobile_app_desc'),
    features: [t('services.features.single_codebase'), t('services.features.native_performance'), t('services.features.smooth_ui')]
  },
  {
    icon: '🎨',
    title: t('services.ui_ux_design'),
    description: t('services.ui_ux_design_desc'),
    features: [t('services.features.modern_design'), t('services.features.user_research'), t('services.features.prototyping')]
  },
  {
    icon: '🛒',
    title: t('services.ecommerce'),
    description: t('services.ecommerce_desc'),
    features: [t('services.features.cart_system'), t('services.features.payment_integration'), t('services.features.admin_dashboard')]
  },
  {
    icon: '📊',
    title: t('services.dashboard_cms'),
    description: t('services.dashboard_cms_desc'),
    features: [t('services.features.realtime_data'), t('services.features.analytics'), t('services.features.easy_management')]
  },
  {
    icon: '🚀',
    title: t('services.performance'),
    description: t('services.performance_desc'),
    features: [t('services.features.speed_optimization'), t('services.features.code_refactoring'), t('services.features.caching')]
  }
];

const ServiceCard = ({ service, index, theme }: { service: Service; index: number; theme: any }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  
  const animations = ['animate-fade-up', 'animate-scale-up', 'animate-fade-right', 'animate-fade-left', 'animate-rotate', 'animate-slide-up-bounce'];
  const animationClass = animations[index % animations.length];
  
  return (
    <div 
      ref={ref}
      className={`p-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-xl dark:hover:shadow-lg hover:-translate-y-2 transition-all animate-on-scroll ${animationClass} ${isVisible ? 'visible' : ''}`}
      style={{
        borderColor: theme.accent_color + '20'
      }}
    >
      <div className="text-5xl mb-5">{service.icon}</div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{service.title}</h3>
      <p className="text-slate-600 dark:text-slate-300 mb-5">{service.description}</p>
      <ul className="space-y-2">
        {service.features && service.features.map((feature, j) => (
          <li key={j} className="flex items-center text-sm text-slate-700 dark:text-slate-400">
            <span className="mr-2" style={{ color: theme.accent_color }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ServicesPage = () => {
  const { theme } = useThemeColors();
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>(getDefaultServices(t));

  useEffect(() => {
    // Update services when language changes
    setServices(getDefaultServices(t));
  }, [t]);

  useEffect(() => {
    fetch(API_ENDPOINTS.services)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        }
      })
      .catch((err) => console.log('Using default services', err));
  }, []);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.3);
  const { ref: contentRef, opacity, scale } = useScrollFade();

  return (
    <>
      <Navbar />
      <section className="pt-32 pb-24 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div 
          ref={contentRef} 
          className="max-w-6xl mx-auto px-6"
          style={{ 
            opacity, 
            transform: `scale(${scale})`,
            transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
          }}
        >
          <div ref={headerRef} className={`text-center mb-16 animate-on-scroll animate-fade-down ${headerVisible ? 'visible' : ''}`}>
            <p className="font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accent_color }}>{t('services.label')}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">{t('services.title')}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('services.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <ServiceCard key={service.id || i} service={service} index={i} theme={theme} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ServicesPage;
