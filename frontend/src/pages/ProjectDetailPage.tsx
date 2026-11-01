import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { navigateTo } from '../utils/navigation';

const ProjectDetailPage = () => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const slug = window.location.pathname.split('/').pop() || '';
    if (!slug) {
      setError('Project not found');
      setLoading(false);
      return;
    }

    fetch(`${API_ENDPOINTS.projectDetails}/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          setProject(data.data);
        } else {
          setError('Project tidak ditemukan');
        }
      })
      .catch(() => setError('Gagal memuat project detail'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0F1419] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-[3px] border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-mono tracking-wider">LOADING</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0F1419] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-slate-500 mb-4">{error || 'Project detail tidak ditemukan'}</p>
          <p className="text-sm text-slate-400 mb-6">
            Project ini belum memiliki case study detail. Tetapi kamu bisa lihat informasi project di halaman projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigateTo('/projects')}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Kembali ke Projects
            </button>
            {project && project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Lihat Project
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  const p = project;
  const d = p.detail || {};

  return (
    <div className="bg-white dark:bg-[#0F1419]">
      {/* ═════════════════════════════════════════════════════════════
          BREADCRUMB
      ═════════════════════════════════════════════════════════════ */}
      <div className="pt-24 pb-8 bg-white dark:bg-[#0F1419] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
            <button onClick={() => navigateTo('/')} className="hover:text-slate-700 dark:hover:text-slate-300">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigateTo('/projects')} className="hover:text-slate-700 dark:hover:text-slate-300">
              Projects
            </button>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300">{p.title}</span>
          </nav>

          {/* Project Title & Meta */}
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-mono font-bold rounded-sm">
                  {p.category}
                </span>
                {d.tagline && (
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono rounded-sm">
                    {d.tagline}
                  </span>
                )}
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {p.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                {p.description}
              </p>
            </div>
            {d.archiveCode && (
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">CASE STUDY</p>
                <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{d.archiveCode}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          HERO SECTION WITH STATS & SCREENSHOT
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-[#0F1419] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            {/* Left: Description & Stats */}
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                {d.overviewDescription || p.description}
              </p>

              {/* Hero Stats */}
              {d.heroStats && d.heroStats.length > 0 && (
                <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                  {d.heroStats.map((stat: any, i: number) => (
                    <div key={i}>
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className={`text-3xl font-bold ${stat.blue ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                          {stat.value}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{stat.label}</span>
                      </div>
                      {stat.sub && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{stat.sub}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Screenshot & Data Viz */}
            <div className="space-y-6">
              {d.screenshotUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="bg-slate-900 border-b border-slate-700 px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-slate-400 font-mono ml-2">logiflow.dashboard</span>
                  </div>
                  <img src={d.screenshotUrl} alt={p.title} className="w-full h-auto" loading="lazy" />
                </div>
              )}

              {/* Data Table/Viz */}
              {d.heroStats && d.heroStats.length > 0 && (
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-800">
                    <p className="text-xs text-slate-400 font-mono">PERFORMANCE METRICS</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {d.heroStats.map((stat: any, i: number) => (
                      <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-800 last:border-b-0">
                        <span className="text-sm text-slate-400">{stat.label}</span>
                        <span className="text-sm font-mono font-bold text-blue-400">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          PROJECT OVERVIEW
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 dark:bg-[#141A24] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {d.overviewTitle || 'Project Overview'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-3xl">
            {d.overviewDescription}
          </p>

          {/* Overview Meta Cards */}
          {d.overviewMeta && d.overviewMeta.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {d.overviewMeta.map((item: any, i: number) => (
                <div key={i} className="bg-white dark:bg-[#0F1419] rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          THE OPERATIONAL BOTTLENECK
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-[#0F1419] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {d.problemTitle || 'The Problem'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-3xl">
            {d.problemDescription}
          </p>

          {/* Bottlenecks Cards */}
          {d.bottlenecks && d.bottlenecks.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {d.bottlenecks.map((item: any, i: number) => (
                <div key={i} className="bg-slate-50 dark:bg-[#141A24] rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{item.desc}</p>
                  <a href="#" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Read disclosure →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          OUR APPROACH
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-900 dark:bg-[#0A0E14]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {d.solutionTitle || 'Our Approach'}
            </h2>
            <p className="text-slate-300">
              {d.solutionDescription}
            </p>
          </div>

          {/* Pipeline Grid */}
          {d.pipeline && d.pipeline.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {d.pipeline.map((item: any, i: number) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl font-bold text-slate-600">{item.num}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          KEY IMPLEMENTED CAPABILITIES (2x4 Grid)
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-[#0F1419] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {d.capabilitiesTitle || 'Key Implemented Capabilities'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12">
            {d.capabilitiesIntro || 'Comprehensive features built into the platform'}
          </p>

          {/* 2x4 Grid */}
          {d.capabilities && d.capabilities.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {d.capabilities.slice(0, 8).map((cap: any, i: number) => {
                const colors = [
                  'bg-blue-50 dark:bg-blue-900/20',
                  'bg-purple-50 dark:bg-purple-900/20',
                  'bg-emerald-50 dark:bg-emerald-900/20',
                  'bg-orange-50 dark:bg-orange-900/20',
                ];
                const textColors = [
                  'text-blue-600 dark:text-blue-400',
                  'text-purple-600 dark:text-purple-400',
                  'text-emerald-600 dark:text-emerald-400',
                  'text-orange-600 dark:text-orange-400',
                ];
                const colorIdx = i % 4;

                return (
                  <div key={i} className={`${colors[colorIdx]} rounded-xl p-6 border border-slate-200 dark:border-slate-700`}>
                    <div className={`w-10 h-10 rounded-lg ${textColors[colorIdx]} text-xl mb-4 flex items-center justify-center`}>
                      {cap.icon || ['🚀', '⚡', '🔒', '📊'][colorIdx]}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">{cap.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{cap.description}</p>
                    <a href="#" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Learn more →
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          INSIDE THE PRODUCT (Tech Specs)
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-900 dark:bg-[#0A0E14] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
            {/* Left: Text */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {d.techTitle || 'Inside the Product'}
              </h2>
              <p className="text-slate-300 mb-8">
                {d.techDescription || 'Technical architecture and implementation details'}
              </p>

              {/* Tech Specs Table */}
              {d.techSpecs && d.techSpecs.length > 0 && (
                <div className="space-y-4">
                  {d.techSpecs.map((spec: any, i: number) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="text-xs text-slate-400 font-mono uppercase mb-1">{spec.category}</div>
                      <div className="text-sm font-bold text-white">{spec.tech}</div>
                      {spec.note && (
                        <div className="text-xs text-slate-400 mt-1">{spec.note}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Screenshot */}
            {d.techImageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
                <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono ml-2">analytics.dashboard</span>
                </div>
                <img src={d.techImageUrl} alt="Tech" className="w-full h-auto" loading="lazy" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          HOW IT WAS BUILT (Timeline/Phases)
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-[#0F1419] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-12">
            {d.howBuiltTitle || 'How It Was Built'}
          </h2>

          {/* Timeline */}
          {d.howBuiltItems && d.howBuiltItems.length > 0 && (
            <div className="space-y-6">
              {d.howBuiltItems.map((item: any, i: number) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {i + 1}
                    </div>
                    {i < (d.howBuiltItems?.length || 0) - 1 && (
                      <div className="w-0.5 h-20 bg-slate-300 dark:bg-slate-700 mt-4" />
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{item.phase}</h3>
                      <span className="text-xs text-slate-500 font-mono">{item.weeks} weeks</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          THE OUTCOME: VERIFIED DELIVERABLES
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 dark:bg-[#141A24] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {d.outcomesTitle || 'The Outcome: Verified Deliverables'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12">
            {d.outcomesDescription || 'Measurable results and business impact'}
          </p>

          {/* Metrics Grid */}
          {d.deliverables && d.deliverables.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {d.deliverables.map((metric: any, i: number) => (
                <div key={i} className="bg-white dark:bg-[#0F1419] rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-4xl mb-4">{metric.icon}</div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{metric.value}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{metric.title}</h3>
                  {metric.note && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">{metric.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          EXPLORE ANOTHER PROJECT
      ═════════════════════════════════════════════════════════════ */}
      {d.relatedSlugs && d.relatedSlugs.length > 0 && (
        <section className="py-20 bg-white dark:bg-[#0F1419] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                Explore Another Project
              </h2>
              <a href="/projects" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View All Projects →
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {['travel-app', 'absensi-siswa-berbasis-qrcode'].map((slug: string, i: number) => (
                <div
                  key={i}
                  onClick={() => navigateTo(`/projects/${slug}`)}
                  className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900" />
                  <div className="p-6 bg-white dark:bg-[#141A24]">
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {slug === 'travel-app' ? 'Travel App' : 'Absensi Siswa'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {slug === 'travel-app'
                        ? 'Platform travel untuk booking paket wisata'
                        : 'Sistem absensi modern dengan face recognition'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════
          BIG CTA SECTION
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Building Something Similar?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Let's explore how we can architect a solution tailored to your operational model and business goals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('/contact')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              Start a Conversation
            </button>
            <button
              onClick={() => navigateTo('/projects')}
              className="px-8 py-4 border border-slate-400 hover:border-white text-white font-semibold rounded-lg transition-colors"
            >
              Explore Our Work
            </button>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          FOOTER
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white dark:bg-[#0F1419] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <p>© 2024 ALZERA. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">
                Terms
              </a>
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">
                Contact
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;
