import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useScrollFade } from '../../hooks/useScrollFade';
import { useThemeColors } from '../../hooks/useThemeColors';
import { API_ENDPOINTS } from '../../config/api';

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  photo: string;
}

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

const TestimonialCard = ({ testimonial, index, theme }: { testimonial: Testimonial; index: number; theme: any }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  
  const animations = ['animate-fade-left', 'animate-fade-up', 'animate-fade-right'];
  const animationClass = animations[index % animations.length];
  
  return (
    <div 
      ref={ref}
      className={`p-8 rounded-2xl shadow-lg border animate-on-scroll ${animationClass} ${isVisible ? 'visible' : ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderColor: theme.accent_color + '20'
      }}
    >
      <div className="text-yellow-400 text-2xl mb-4">
        {'⭐'.repeat(Math.min(testimonial.rating, 5))}
      </div>
      <p className="text-slate-700 mb-6 text-lg italic">"{testimonial.content}"</p>
      <div className="flex items-center gap-4">
        <img 
          src={testimonial.photo} 
          alt={testimonial.name} 
          className="w-14 h-14 rounded-full object-cover border-2"
          style={{ borderColor: theme.accent_color }}
        />
        <div>
          <p className="font-semibold text-slate-900">{testimonial.name}</p>
          <p className="text-slate-500 text-sm">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const { theme } = useThemeColors();

  useEffect(() => {
    fetch(API_ENDPOINTS.testimonials)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
          setTestimonials(res.data);
        }
      })
      .catch((err) => console.log('Using default testimonials', err));
  }, []);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.3);
  const { ref: contentRef, opacity, scale } = useScrollFade();

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div 
        ref={contentRef} 
        className="max-w-6xl mx-auto px-6"
        style={{ 
          opacity, 
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        <div ref={headerRef} className={`text-center mb-16 animate-on-scroll animate-slide-up-bounce ${headerVisible ? 'visible' : ''}`}>
          <p className="font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accent_color }}>Testimoni</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Apa Kata Mereka?</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={testimonial.id || i} testimonial={testimonial} index={i} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
