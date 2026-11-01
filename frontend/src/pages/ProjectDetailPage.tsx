import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { navigateTo } from '../utils/navigation';

/* ─── tiny SVG icon set ─────────────────────────────────────────── */
const Icon = {
  arrowRight: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  arrowDown: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  zap: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  target: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  layers: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l9 4.5L12 11 3 6.5 12 2zm0 7l9 4.5L12 18l-9-4.5L12 9zm0 7l9 4.5L12 25l-9-4.5L12 16z" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  eye: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  doc: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  monitor: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

const capIcons = [Icon.zap, Icon.target, Icon.doc, Icon.shield, Icon.chart, Icon.code, Icon.eye, Icon.monitor];

const ProjectDetailPage = ({ projectSlug }: { projectSlug?: string }) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState('628818411915');
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);

  useEffect(() => {
    const slug = projectSlug || window.location.pathname.split('/').pop() || '';
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.projectDetails}/${slug}`);
        const data = await res.json();
        if (data.status === 'success' && data.data) {
          setProject(data.data);
        } else {
          setError('Project tidak ditemukan');
        }
      } catch {
        setError('Gagal memuat project detail');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectSlug]);

  useEffect(() => {
    fetch(API_ENDPOINTS.profile)
      .then(r => r.json())
      .then(res => { if (res.data?.whatsapp) setWhatsapp(res.data.whatsapp.replace(/\D/g, '')); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [projectSlug]);

  // Fetch related projects when relatedSlugs available
  useEffect(() => {
    const slugs: string[] = project?.detail?.relatedSlugs || [];
    if (!slugs.length) return;
    Promise.all(
      slugs.slice(0, 2).map(s =>
        fetch(`${API_ENDPOINTS.projectDetails}/${s}`).then(r => r.json()).catch(() => null)
      )
    ).then(results => {
      const valid = results.filter(r => r?.status === 'success' && r.data).map(r => r.data);
      setRelatedProjects(valid);
    });
  }, [project]);

  /* ── loading ── */
  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#080D1D] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );

  /* ── error ── */
  if (error || !project) return (
    <div className="min-h-screen bg-white dark:bg-[#080D1D] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-slate-500 mb-4">{error || 'Project tidak ditemukan'}</p>
        <button onClick={() => navigateTo('/projects')} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
          Back to Projects
        </button>
      </div>
    </div>
  );

  const p = project;
  const d = p.detail || {};
  const heroStats: any[] = Array.isArray(d.heroStats) ? d.heroStats : [];
  const overviewMeta: any[] = Array.isArray(d.overviewMeta) ? d.overviewMeta : [];
  const bottlenecks: any[] = Array.isArray(d.bottlenecks) ? d.bottlenecks : [];
  const pipeline: any[] = Array.isArray(d.pipeline) ? d.pipeline : [];
  const capabilities: any[] = Array.isArray(d.capabilities) ? d.capabilities : [];
  const techSpecs: any[] = Array.isArray(d.techSpecs) ? d.techSpecs : [];
  const deliverables: any[] = Array.isArray(d.deliverables) ? d.deliverables : [];
  const relatedSlugs: string[] = Array.isArray(d.relatedSlugs) ? d.relatedSlugs : [];

  return (
    <div className="bg-white dark:bg-[#080D1D]">

      {/* ── BREADCRUMB ── */}
      <div className="pt-20 border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#080D1D]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <button onClick={() => navigateTo('/')} className="hover:text-slate-800 dark:hover:text-white transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => navigateTo('/projects')} className="hover:text-slate-800 dark:hover:text-white transition-colors">Projects</button>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">{p.title}</span>
          </nav>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              Case Study // {p.year || '2024'}
            </span>
            <span className="text-slate-400 dark:text-slate-500">ALZERA Project Archive</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-[#080D1D] py-16 lg:py-24 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">

            {/* LEFT */}
            <div>
              {/* Category tags */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="px-2.5 py-1 rounded bg-blue-600/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                  {p.category || d.tagline || 'WEB APPLICATION'}
                </span>
                {d.tagline && d.tagline !== p.category && (
                  <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono font-semibold uppercase tracking-widest">
                    {d.tagline}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-bold text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-5">
                {p.title}
              </h1>

              {/* Description */}
              <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mb-8">
                {p.description}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mb-10">
                {p.link && p.link !== '#' ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-md shadow-blue-600/20">
                    View Live Demo {Icon.arrowRight}
                  </a>
                ) : null}
                <button
                  onClick={() => { const el = document.getElementById('overview'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  Explore the Architecture {Icon.arrowDown}
                </button>
              </div>

              {/* Hero Stats */}
              {heroStats.length > 0 && (
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                  {heroStats.slice(0, 3).map((s: any, i: number) => (
                    <div key={i}>
                      <div className={`text-2xl sm:text-3xl font-bold ${s.blue ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                        {s.value}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1.5">{s.label}</div>
                      {s.sub && <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{s.sub}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — browser screenshot */}
            <div>
              <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
                {/* browser bar */}
                <div className="bg-[#1a1f2e] border-b border-slate-700 px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-slate-800 rounded px-3 py-1 text-[10px] font-mono text-slate-400 truncate">
                      {d.screenshotUrl ? `console.${p.slug}.internal` : 'No preview available'}
                    </div>
                  </div>
                  {p.metric && (
                    <span className="text-[10px] font-mono text-green-400 font-bold hidden sm:block">{p.metric} {p.metricLabel}</span>
                  )}
                </div>
                {/* screenshot */}
                {d.screenshotUrl ? (
                  <img src={d.screenshotUrl} alt={p.title} className="w-full h-auto block" />
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center mx-auto mb-3">
                        {Icon.monitor}
                      </div>
                      <p className="text-slate-500 text-sm">No screenshot available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 01 — PROJECT OVERVIEW
      ══════════════════════════════════════════════════════════ */}
      {d.overviewBody && (
        <section id="overview" className="bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-blue-600 dark:text-blue-500 mb-3">
                Section 01 // Executive Context
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                Project Overview
              </h2>
            </div>

            <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-12">
              {d.overviewBody}
            </p>

            {overviewMeta.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {overviewMeta.map((m: any, i: number) => (
                  <div key={i} className="p-5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">{m.label}</p>
                    <p className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">{m.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{m.sub}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 02 — THE OPERATIONAL BOTTLENECK
      ══════════════════════════════════════════════════════════ */}
      {bottlenecks.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-950/60 py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-blue-600 dark:text-blue-500 mb-3">
                Section 02 // Operational Friction
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                The Operational Bottleneck
              </h2>
              {d.bottleneckIntro && (
                <p className="text-[15px] text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">{d.bottleneckIntro}</p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {bottlenecks.map((bn: any, i: number) => (
                <div key={i} className="p-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col">
                  {/* icon + number */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      {capIcons[i % capIcons.length]}
                    </div>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{bn.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">{bn.desc}</p>

                  {/* observed impact */}
                  {bn.impact && (
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Observed Impact:</p>
                      <p className="text-sm font-bold text-red-500 dark:text-red-400">{bn.impact}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 03 — ENGINEERING STRATEGY  (dark bg)
      ══════════════════════════════════════════════════════════ */}
      {pipeline.length > 0 && (
        <section className="bg-[#0f172a] dark:bg-slate-950 py-20 lg:py-28 border-b border-slate-800">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-blue-400 mb-3">
                Section 03 // Engineering Strategy
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                Our Approach: Deterministic Workflow Engineering
              </h2>
              {d.strategyBody && (
                <p className="text-[15px] text-slate-300 max-w-3xl leading-relaxed">{d.strategyBody}</p>
              )}
            </div>

            {/* Pipeline — horizontal 4-col card */}
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
              {/* header bar */}
              <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-slate-300 font-semibold">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Telemetry &amp; Dispatch Ingestion Pipeline
                </div>
                {d.pipelineNote && (
                  <span className="text-[10px] font-mono text-slate-400">{d.pipelineNote}</span>
                )}
              </div>

              {/* steps grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-700">
                {pipeline.slice(0, 4).map((step: any, i: number) => (
                  <div key={i} className="p-5">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                      {String(i + 1).padStart(2, '0')}. {step.label}
                    </p>
                    <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                    {step.perf && (
                      <p className="text-[10px] font-mono text-blue-400 mt-3">{step.perf}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* footer */}
              {d.pipelineNoteRight && (
                <div className="px-5 py-3 border-t border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {d.pipelineNoteRight}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 04 — KEY IMPLEMENTED CAPABILITIES
      ══════════════════════════════════════════════════════════ */}
      {capabilities.length > 0 && (
        <section className="bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-blue-600 dark:text-blue-500 mb-3">
                Section 04 // Product Capabilities
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                Key Implemented Capabilities
              </h2>
              {d.capabilitiesIntro && (
                <p className="text-[15px] text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">{d.capabilitiesIntro}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {capabilities.map((cap: any, i: number) => {
                const tags: string[] = Array.isArray(cap.tags) ? cap.tags : [];
                const kvPairs: any[] = Array.isArray(cap.keyValues) ? cap.keyValues : [];
                return (
                  <div key={i} className="p-7 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col">
                    {/* icon row */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        {capIcons[i % capIcons.length]}
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {tags.map((t: string, ti: number) => (
                            <span key={ti} className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{cap.name}</h3>
                    {cap.desc && <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">{cap.desc}</p>}

                    {/* key-value pairs */}
                    {kvPairs.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-x-4 gap-y-2">
                        {kvPairs.map((kv: any, ki: number) => (
                          <div key={ki} className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">{kv.key}:</span>
                            <span className={`font-semibold ${kv.blue ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{kv.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* fallback: status only */}
                    {kvPairs.length === 0 && cap.status && (
                      <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{cap.status}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 05 — INSIDE THE PRODUCT  (screenshot full-width)
      ══════════════════════════════════════════════════════════ */}
      {d.screenshotUrl && (
        <section className="bg-slate-50 dark:bg-slate-950/60 py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-blue-600 dark:text-blue-500 mb-3">
                Section 05 // Visual System
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                Inside the Product: Crafted for Speed &amp; High-Stress Operations
              </h2>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Every screen was built to reduce cognitive friction for operators juggling dozens of incoming and outgoing tasks simultaneously.
              </p>
            </div>

            {/* Big browser mockup */}
            <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
              <div className="bg-[#1a1f2e] border-b border-slate-700 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">Console // Main Dispatch Matrix View</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 hidden sm:block">Display Mode: High-Density (1080p+)</span>
              </div>
              <img src={d.screenshotUrl} alt={`${p.title} dashboard`} className="w-full h-auto block" />
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 06 — HOW IT WAS BUILT  (tech specs)
      ══════════════════════════════════════════════════════════ */}
      {techSpecs.length > 0 && (
        <section className="bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-blue-600 dark:text-blue-500 mb-3">
                Section 06 // Technical Specifications
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                How It Was Built
              </h2>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Clean, disciplined engineering choices designed for sustained production stability, minimal maintenance overhead, and rapid cold starts.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {techSpecs.map((tech: any, i: number) => {
                const subTags: string[] = Array.isArray(tech.tags) ? tech.tags : (tech.tech ? [tech.tech] : []);
                return (
                  <div key={i} className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {String(i + 1).padStart(2, '0')} // {tech.category}
                    </p>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{tech.tech || tech.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{tech.desc}</p>
                    {subTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                        {subTags.map((t: string, ti: number) => (
                          <span key={ti} className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 07 — THE OUTCOME: VERIFIED DELIVERABLES
      ══════════════════════════════════════════════════════════ */}
      {deliverables.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-950/60 py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-blue-600 dark:text-blue-500 mb-3">
                Section 07 // Verifiable Deliverables
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                The Outcome: Verified Deliverables
              </h2>
              {d.deliverablesIntro && (
                <p className="text-[15px] text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">{d.deliverablesIntro}</p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-5">
              {deliverables.slice(0, 3).map((del: any, i: number) => (
                <div key={i} className="p-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                    Deliverable {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {typeof del === 'string' ? del : del.item}
                  </h3>
                  {del.desc && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">{del.desc}</p>
                  )}
                  {del.value && (
                    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{del.value}</p>
                      {del.valueLabel && <p className="text-xs text-slate-500 mt-1">{del.valueLabel}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* disclaimer */}
            {d.deliverablesDisclaimer && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/40">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{d.deliverablesDisclaimer}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 08 — EXPLORE ANOTHER PROJECT
      ══════════════════════════════════════════════════════════ */}
      {relatedSlugs.length > 0 && (
        <section className="bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="flex items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-blue-600 dark:text-blue-500 mb-3">
                  Section 08 // More Case Studies
                </p>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Explore Another Project
                </h2>
              </div>
              <button
                onClick={() => navigateTo('/projects')}
                className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline whitespace-nowrap flex-shrink-0">
                ← Back to All Projects
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {relatedProjects.length > 0
                ? relatedProjects.map((rp: any, i: number) => (
                  <button key={i} onClick={() => navigateTo(`/projects/${rp.slug}`)}
                    className="p-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-900 transition-all text-left group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          {rp.category || 'PROJECT'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          // {rp.year || '2024'}
                        </span>
                      </div>
                      <span className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">→</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {rp.title}
                    </h3>
                    {rp.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{rp.description}</p>
                    )}
                    {Array.isArray(rp.tech) && rp.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {rp.tech.slice(0, 4).map((t: string, ti: number) => (
                          <span key={ti} className="text-[10px] text-slate-500 dark:text-slate-400">
                            {ti > 0 && <span className="mr-1.5 text-slate-300 dark:text-slate-600">•</span>}
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))
                : relatedSlugs.slice(0, 2).map((slug: string, i: number) => (
                  <button key={i} onClick={() => navigateTo(`/projects/${slug}`)}
                    className="p-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all text-left group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        Case Study // {new Date().getFullYear()}
                      </span>
                      <span className="text-slate-400 group-hover:text-blue-600 transition-colors">→</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors capitalize">
                      {slug.replace(/-/g, ' ')}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-4">View Case Study →</p>
                  </button>
                ))
              }
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#080D1D] dark:bg-slate-950 py-24 lg:py-32">
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[.2em] text-blue-400 mb-6">
            ALZERA DIGITAL CONSULTANCY
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.08] tracking-tight">
            Building Something Similar?
          </h2>
          <p className="text-[15px] text-slate-300 mb-10 leading-relaxed">
            Tell us about your operations, bottlenecks, and the digital tools you need. Let's explore the right architecture for your business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={() => navigateTo('/contact')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm">
              Discuss Your Project
            </button>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors text-sm text-center">
              Explore Our Services
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Fast 24-hour response confirmation. Direct developer contact.
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProjectDetailPage;
