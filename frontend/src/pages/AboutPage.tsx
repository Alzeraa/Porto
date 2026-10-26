import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScrollFade } from '../hooks/useScrollFade';
import { useThemeColors } from '../hooks/useThemeColors';
import { useLanguage } from '../hooks/useLanguage';
import { API_ENDPOINTS } from '../config/api';

interface TeamMember {
  id?: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const defaultTeam: TeamMember[] = [
  {
    name: 'Alvaeryn',
    role: 'Founder & Full Stack Developer',
    bio: 'Spesialis dalam pengembangan web dan aplikasi mobile dengan pengalaman lebih dari 2 tahun.',
    image: '/founder.jpeg'
  },
  {
    name: 'Carisa R Ryanti',
    role: 'Mobile App & UI/UX Developer',
    bio: 'Spesialis dalam pengembangan aplikasi mobile dan desain UI/UX yang kreatif dan responsif.',
    image: '/ica.jpeg'
  },
  {
    name: 'Revalin Amalia',
    role: 'UI/UX Designer',
    bio: 'Desainer kreatif yang fokus pada pengalaman pengguna yang intuitif dan menarik.',
    image: '/revalin.jpeg'
  }
];

const TeamMemberCard = ({ member, index, theme }: { member: TeamMember; index: number; theme: any }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);

  const animations = ['animate-fade-up', 'animate-rotate', 'animate-scale-up'];
  const animationClass = animations[index % animations.length];

  return (
    <div
      ref={ref}
      className={`p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center hover:-translate-y-2 transition-all duration-300 animate-on-scroll ${animationClass} ${
        isVisible ? 'visible' : ''
      }`}
      style={{
        borderColor: theme.accent_color + '20'
      }}
    >
      <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4" style={{ borderColor: theme.accent_color + '40' }}>
        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{member.name}</h3>
      <p className="font-semibold text-sm mb-4" style={{ color: theme.accent_color }}>
        {member.role}
      </p>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{member.bio}</p>
    </div>
  );
};

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeam);
  const { theme } = useThemeColors();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(API_ENDPOINTS.team)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
          setTeamMembers(res.data);
        }
      })
      .catch((err) => console.log('Using default team', err));
  }, []);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.3);
  const { ref: contentRef, opacity, scale } = useScrollFade();

  return (
    <>
      <div
        ref={contentRef}
        style={{
          opacity,
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        {/* Header */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
          <div ref={headerRef} className={`max-w-6xl mx-auto px-6 text-center animate-on-scroll animate-fade-down ${headerVisible ? 'visible' : ''}`}>
            <span className="inline-block px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
              {t('team.label')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              {t('team.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Tim profesional yang siap membantu mewujudkan visi digital Anda
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="animate-on-scroll animate-fade-right visible">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  Tentang Alvaeryn
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-4">
                  Alvaeryn adalah sebuah digital agency dan software engineering studio yang berdedikasi untuk menciptakan solusi digital berkualitas tinggi untuk bisnis modern.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-4">
                  Dengan tim yang berpengalaman dan passionate, kami siap mengubah ide-ide Anda menjadi produk digital yang luar biasa.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div>
                    <p className="text-3xl font-bold" style={{ color: theme.accent_color }}>
                      50+
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">Project Selesai</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold" style={{ color: theme.accent_color }}>
                      30+
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">Klien Puas</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold" style={{ color: theme.accent_color }}>
                      5+
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">Tahun Pengalaman</p>
                  </div>
                </div>
              </div>
              <div className="animate-on-scroll animate-fade-left visible">
                <img
                  src="/founder.jpeg"
                  alt="Alvaeryn Studio"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              Tim Kami
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, i) => (
                <TeamMemberCard key={member.id || i} member={member} index={i} theme={theme} />
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              Nilai-Nilai Kami
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-xl text-center hover:shadow-lg transition-all">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Fokus pada Hasil</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Kami fokus memberikan solusi yang memberikan impact nyata untuk bisnis Anda
                </p>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-xl text-center hover:shadow-lg transition-all">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Kolaborasi</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Kami bekerja sama dengan klien sebagai partner untuk mencapai kesuksesan bersama
                </p>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-xl text-center hover:shadow-lg transition-all">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Inovasi</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Kami selalu mencari cara baru dan lebih baik untuk menyelesaikan setiap tantangan
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
