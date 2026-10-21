import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useScrollFade } from '../../hooks/useScrollFade';
import { useThemeColors } from '../../hooks/useThemeColors';
import { API_ENDPOINTS } from '../../config/api';

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
      className={`p-8 rounded-2xl shadow-lg border text-center hover:-translate-y-2 transition-all duration-300 animate-on-scroll ${animationClass} ${isVisible ? 'visible' : ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderColor: theme.accent_color + '20'
      }}
    >
      <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4" style={{ borderColor: theme.accent_color + '40' }}>
        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-bold text-xl text-slate-900 mb-2">{member.name}</h3>
      <p className="font-semibold text-sm mb-4" style={{ color: theme.accent_color }}>{member.role}</p>
      <p className="text-slate-600 text-sm">{member.bio}</p>
    </div>
  );
};

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeam);
  const { theme } = useThemeColors();

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
    <section id="team" className="py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div 
        ref={contentRef} 
        className="max-w-6xl mx-auto px-6"
        style={{ 
          opacity, 
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        <div ref={headerRef} className={`text-center mb-16 animate-on-scroll animate-rotate ${headerVisible ? 'visible' : ''}`}>
          <p className="font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accent_color }}>Tim Kami</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Orang-Orang Hebat di Balik Layar</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <TeamMemberCard key={member.id || i} member={member} index={i} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
