import { useState } from 'react';
import { useScrollFade } from '../hooks/useScrollFade';
import { useThemeColors } from '../hooks/useThemeColors';
import { navigateToSection } from '../utils/navigation';

interface ProjectDetail {
  id?: number;
  title: string;
  category: string;
  description: string;
  fullDescription?: string;
  tech: string[];
  image: string;
  link?: string;
  features?: string[];
}

const defaultProject: ProjectDetail = {
  title: 'LogiFlow Dispatch & Fleet Portal',
  category: 'Web Application',
  description: 'Real-time dispatch dashboard and route coordination system.',
  fullDescription: 'LogiFlow adalah sistem dispatch dan manajemen fleet yang komprehensif untuk perusahaan logistik modern. Platform ini dirancang untuk memudahkan koordinasi rute, tracking real-time, dan optimisasi operasional fleet dengan interface yang intuitif.',
  tech: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'Express', 'PostgreSQL', 'PostGIS'],
  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
  link: 'https://github.com',
  features: [
    'Real-time GPS tracking untuk semua fleet unit',
    'Optimisasi rute otomatis menggunakan algoritma canggih',
    'Dashboard analytics untuk monitoring performa driver',
    'Sistem notifikasi terintegrasi dengan mobile app',
    'Integrasi dengan payment gateway untuk pembayaran',
    'Multi-user access dengan role-based permissions',
    'Export report otomatis dan scheduling',
    'Mobile responsif untuk on-the-go management'
  ]
};

const ProjectDetailPage = ({ projectId }: { projectId: string }) => {
  const [project] = useState<ProjectDetail>(defaultProject);
  const { theme } = useThemeColors();
  const { ref: contentRef, opacity, scale } = useScrollFade();

  // Fetch project detail dari API berdasarkan projectId
  // Untuk saat ini menggunakan default data
  console.log('Viewing project:', projectId);

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
        {/* Hero Image */}
        <section className="pt-32 pb-12 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: theme.accent_color }}>
                  {project.category}
                </p>
                <h1 className="text-4xl md:text-6xl font-bold">{project.title}</h1>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Tentang Project</h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                  {project.fullDescription || project.description}
                </p>

                {/* Features */}
                {project.features && project.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Fitur Utama</h3>
                    <ul className="space-y-3">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1"
                            style={{ background: theme.accent_color }}
                          >
                            ✓
                          </span>
                          <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Tech Stack */}
                <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm font-semibold rounded-full text-white"
                        style={{ background: theme.accent_color }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl">
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Tertarik dengan project ini?</p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-3 px-6 rounded-lg text-white font-semibold transition-all hover:scale-105 mb-3"
                      style={{ background: theme.accent_color }}
                    >
                      Lihat Repository
                    </a>
                  )}
                  <button
                    onClick={() => navigateToSection('/contact')}
                    className="block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all hover:scale-105 border-2"
                    style={{ borderColor: theme.accent_color, color: theme.accent_color }}
                  >
                    Hubungi Kami
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More Projects CTA */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Project Lainnya</h2>
            <button
              onClick={() => navigateToSection('/projects')}
              className="px-8 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105"
              style={{ background: theme.accent_color }}
            >
              Lihat Semua Project
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectDetailPage;
