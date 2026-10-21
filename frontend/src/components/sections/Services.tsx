import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useScrollFade } from '../../hooks/useScrollFade';
import { useThemeColors } from '../../hooks/useThemeColors';
import { API_ENDPOINTS } from '../../config/api';

interface Service {
  id?: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const defaultServices: Service[] = [
  {
    icon: '🌐',
    title: 'Web Development',
    description: 'Membangun website modern dengan React, Next.js, dan performa optimal.',
    features: ['Responsive Design', 'SEO Friendly', 'Fast Loading']
  },
  {
    icon: '📱',
    title: 'Mobile App',
    description: 'Aplikasi cross-platform dengan React Native & Flutter untuk iOS dan Android.',
    features: ['Single Codebase', 'Native Performance', 'Smooth UI']
  },
  {
    icon: '🎨',
    title: 'UI/UX Design',
    description: 'Desain interface yang menarik dan user-friendly dengan Figma.',
    features: ['Modern Design', 'User Research', 'Prototyping']
  },
  {
    icon: '🛒',
    title: 'E-Commerce',
    description: 'Toko online lengkap dengan payment gateway dan manajemen produk.',
    features: ['Cart System', 'Payment Integration', 'Admin Dashboard']
  },
  {
    icon: '📊',
    title: 'Dashboard & CMS',
    description: 'Panel admin kustom untuk mengelola konten dan data bisnis.',
    features: ['Real-time Data', 'Analytics', 'Easy Management']
  },
  {
    icon: '🚀',
    title: 'Performance Optimization',
    description: 'Optimalkan kecepatan dan performa website kamu.',
    features: ['Speed Optimization', 'Code Refactoring', 'Caching']
  }
];

const ServiceCard = ({ service, index, theme }: { service: Service; index: number; theme: any }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  
  const animations = ['animate-fade-up', 'animate-scale-up', 'animate-fade-right', 'animate-fade-left', 'animate-rotate', 'animate-slide-up-bounce'];
  const animationClass = animations[index % animations.length];
  
  return (
    <div 
      ref={ref}
      className={`p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all animate-on-scroll ${animationClass} ${isVisible ? 'visible' : ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderColor: theme.accent_color + '20'
      }}
    >
      <div className="text-5xl mb-5">{service.icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
      <p className="text-slate-600 mb-5">{service.description}</p>
      <ul className="space-y-2">
        {service.features && service.features.map((feature, j) => (
          <li key={j} className="flex items-center text-sm text-slate-700">
            <span className="mr-2" style={{ color: theme.accent_color }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Services = () => {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const { theme } = useThemeColors();

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
    <section id="services" className="py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div 
        ref={contentRef} 
        className="max-w-6xl mx-auto px-6"
        style={{ 
          opacity, 
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        <div ref={headerRef} className={`text-center mb-12 animate-on-scroll animate-fade-down ${headerVisible ? 'visible' : ''}`}>
          <p className="font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accent_color }}>Keahlian Kami</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Layanan yang Kami Sediakan</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.id || i} service={service} index={i} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
