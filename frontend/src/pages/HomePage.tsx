import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScrollFade } from '../hooks/useScrollFade';
import { useThemeColors } from '../hooks/useThemeColors';
import { useLanguage } from '../hooks/useLanguage';
import { API_ENDPOINTS } from '../config/api';
import Hero from '../components/sections/Hero';
import Contact from '../components/sections/Contact';

interface Service {
  id?: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  photo: string;
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
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Rizky Pratama',
    role: 'Owner Toko Fashion',
    content: 'Hasilnya luar biasa! Website toko online saya jadi cepat dan profesional. Penjualan naik 35%!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Siti Nurhaliza',
    role: 'Founder Startup Edukasi',
    content: 'Desain UI/UXnya sangat intuitive dan modern. User feedbacknya positif banget!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    name: 'Ahmad Fauzi',
    role: 'CEO Tech Company',
    content: 'Kerja sama dengan Alvaeryn sangat menyenangkan. Komunikasi dan hasilnya sesuai ekspektasi!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

const ServiceCard = ({ service, index, theme }: { service: Service; index: number; theme: any }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  
  const animations = ['animate-fade-up', 'animate-scale-up', 'animate-fade-right'];
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

const TestimonialCard = ({ testimonial, index, theme }: { testimonial: Testimonial; index: number; theme: any }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  
  const animations = ['animate-fade-left', 'animate-fade-up', 'animate-fade-right'];
  const animationClass = animations[index % animations.length];
  
  return (
    <div 
      ref={ref}
      className={`p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 animate-on-scroll ${animationClass} ${isVisible ? 'visible' : ''}`}
      style={{
        borderColor: theme.accent_color + '20'
      }}
    >
      <div className="text-yellow-400 text-2xl mb-4">
        {'⭐'.repeat(Math.min(testimonial.rating, 5))}
      </div>
      <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg italic">"{testimonial.content}"</p>
      <div className="flex items-center gap-4">
        <img 
          src={testimonial.photo} 
          alt={testimonial.name} 
          className="w-14 h-14 rounded-full object-cover border-2"
          style={{ borderColor: theme.accent_color }}
        />
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const { theme } = useThemeColors();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(API_ENDPOINTS.services)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        }
      })
      .catch((err) => console.log('Using default services', err));

    fetch(API_ENDPOINTS.testimonials)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
          setTestimonials(res.data);
        }
      })
      .catch((err) => console.log('Using default testimonials', err));
  }, []);

  const { ref: servicesHeaderRef, isVisible: servicesHeaderVisible } = useScrollAnimation(0.3);
  const { ref: testimonialsHeaderRef, isVisible: testimonialsHeaderVisible } = useScrollAnimation(0.3);
  const { ref: contentRef, opacity, scale } = useScrollFade();

  return (
    <>
      <Hero />
      
      {/* Services Section */}
      <section className="py-24 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div 
          ref={contentRef} 
          className="max-w-6xl mx-auto px-6"
          style={{ 
            opacity, 
            transform: `scale(${scale})`,
            transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
          }}
        >
          <div ref={servicesHeaderRef} className={`text-center mb-16 animate-on-scroll animate-fade-down ${servicesHeaderVisible ? 'visible' : ''}`}>
            <p className="font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accent_color }}>{t('services.label')}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">{t('services.title')}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service, i) => (
              <ServiceCard key={service.id || i} service={service} index={i} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div 
          className="max-w-6xl mx-auto px-6"
          style={{ 
            opacity, 
            transform: `scale(${scale})`,
            transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
          }}
        >
          <div ref={testimonialsHeaderRef} className={`text-center mb-16 animate-on-scroll animate-fade-down ${testimonialsHeaderVisible ? 'visible' : ''}`}>
            <p className="font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accent_color }}>{t('testimonials.label')}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">{t('testimonials.title')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={testimonial.id || i} testimonial={testimonial} index={i} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
};

export default HomePage;
