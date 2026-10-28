import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useThemeColors } from '../../hooks/useThemeColors';

const About = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.1);
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation(0.1);
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation(0.1);
  const { theme } = useThemeColors();

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={headerRef} className={`text-center mb-16 animate-on-scroll animate-fade-down ${headerVisible ? 'visible' : ''}`}>
          <p className="font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accent_color }}>Tentang</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Tentang Kami</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div ref={leftRef} className={`animate-on-scroll animate-fade-left ${leftVisible ? 'visible' : ''}`}>
            <div 
              className="w-64 h-64 mx-auto rounded-full flex items-center justify-center text-6xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${theme.primary_light}, ${theme.accent_color})` }}
            >
              A
            </div>
          </div>
          <div ref={rightRef} className={`animate-on-scroll animate-fade-right ${rightVisible ? 'visible' : ''}`}>
            <p className="text-lg text-gray-300 mb-6">
              Halo! Kami adalah ALZERA, tim pengembang full stack yang bersemangat dalam menciptakan solusi yang elegan dan efisien. 
              Kami mengkhususkan diri dalam membangun aplikasi web modern dengan teknologi terbaru.
            </p>
            <p className="text-lg text-gray-300">
              Dengan ketelitian dalam desain dan komitmen untuk menulis kode yang bersih dan terawat, 
              kami berusaha memberikan pengalaman pengguna yang luar biasa di setiap proyek yang kami kerjakan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

