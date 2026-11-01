import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { navigateTo } from '../utils/navigation';

/* ─── SVG icon set ──────────────────────────────────────────────── */
const Icons = {
  arrowRight: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  arrowDown: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  externalLink: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  zap: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  shield: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  chart: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  target: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  code: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  eye: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  doc: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  monitor: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  info: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  layers: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l9 4.5L12 11 3 6.5 12 2zm0 7l9 4.5L12 18l-9-4.5L12 9z" />
    </svg>
  ),
};

const capIcons = [
  Icons.zap, Icons.target, Icons.doc, Icons.shield,
  Icons.chart, Icons.code, Icons.eye, Icons.monitor,
];

/* ─── tiny reusable Label ─────────────────────────────────────── */
const SectionLabel = ({ n, text, light = false }: { n: string; text: string; light?: boolean }) => (
  <p className={`text-[10px] font-mono font-bold uppercase tracking-[.18em] mb-3 ${light ? 'text-blue-400' : 'text-blue-600 dark:text-blue-500'}`}>
    {n} // {text}
  </p>
);

/* ─── Browser frame wrapper ───────────────────────────────────── */
const BrowserFrame = ({
  children,
  label,
  statusRight,
  className = '',
}: {
  children: React.ReactNode;
  label?: string;
  statusRight?: string;
  className?: string;
}) => (
  <div className={`rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl ${className}`}>
    <div className="bg-[#161b2e] border-b border-slate-700/80 px-4 py-2.5 flex items-center gap-3">
      <div className="flex gap-1.5 flex-shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </div>
      {label && (
        <div className="flex-1 mx-2">
          <div className="max-w-[280px] bg-slate-800/80 rounded px-3 py-1 text-[10px] font-mono text-slate-400 truncate">
            {label}
          </div>
        </div>
      )}
      {statusRight && (
        <span className="ml-auto text-[10px] font-mono text-green-400 font-semibold hidden sm:block">{statusRight}</span>
      )}
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const ProjectDetailPage = ({ projectSlug }: { projectSlug?: string }) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState('628818411915');
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);

  useEffect(() => {
    const slug = projectSlug || window.location.pathname.split('/').pop() || '';
    setLoading(true);
    fetch(`${API_ENDPOINTS.projectDetails}/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success' && data.data) setProject(data.data);
        else setError('Project tidak ditemukan');
      })
      .catch(() => setError('Gagal memuat project detail'))
      .finally(() => setLoading(false));
  }, [projectSlug]);

  useEffect(() => {
    fetch(API_ENDPOINTS.profile)
      .then(r => r.json())
      .then(res => { if (res.data?.whatsapp) setWhatsapp(res.data.whatsapp.replace(/\D/g, '')); })
      .catch(() => {});
  }, []);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [projectSlug]);

  useEffect(() => {
    const slugs: string[] = project?.detail?.relatedSlugs || [];
    if (!slugs.length) return;
    Promise.all(
      slugs.slice(0, 2).map(s =>
        fetch(`${API_ENDPOINTS.projectDetails}/${s}`).then(r => r.json()).catch(() => null)
      )
    ).then(results => {
      setRelatedProjects(
        results.filter(r => r?.status === 'success' && r.data).map(r => r.data)
      );
    });
  }, [project]);

  /* ── loading ── */
  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#080D1D] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-[3px] border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-mono tracking-wider">LOADING PROJECT</p>
      </div>
    </div>
  );

  /* ── error ── */
  if (error || !project) return (
    <div className="min-h-screen bg-white dark:bg-[#080D1D] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-slate-500 mb-4">{error || 'Project tidak ditemukan'}</p>
        <button onClick={() => navigateTo('/projects')}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          Back to Projects
        </button>
      </div>
    </div>
  );

  const p = project;
  const d = p.detail || {};
  const heroStats: any[]       = Array.isArray(d.heroStats)      ? d.heroStats      : [];
  const overviewMeta: any[]    = Array.isArray(d.overviewMeta)   ? d.overviewMeta   : [];
  const bottlenecks: any[]     = Array.isArray(d.bottlenecks)    ? d.bottlenecks    : [];
  const pipeline: any[]        = Array.isArray(d.pipeline)       ? d.pipeline       : [];
  const capabilities: any[]    = Array.isArray(d.capabilities)   ? d.capabilities   : [];
  const techSpecs: any[]       = Array.isArray(d.techSpecs)      ? d.techSpecs      : [];
  const deliverables: any[]    = Array.isArray(d.deliverables)   ? d.deliverables   : [];
  const relatedSlugs: string[] = Array.isArray(d.relatedSlugs)   ? d.relatedSlugs   : [];

  return (
    <div className="bg-white dark:bg-[#080D1D] overflow-x-hidden">

      {/* ── BREADCRUMB ───────────────────────────────────────────── */}
      <div className="pt-20 bg-white dark:bg-[#080D1D] border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-11 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <button onClick={() => navigateTo('/')}
              className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Home</button>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <button onClick={() => navigateTo('/projects')}
              className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Projects</button>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">{p.title}</span>
          </nav>
          <div className="hidden sm:flex items-center gap-5 text-[10px] font-mono">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Case Study // {p.year || '2024'}
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              ALZERA Project Archive #{p.archiveCode || 'CS-04'}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          §1 HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-[#080D1D] py-16 lg:py-24 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">

            {/* LEFT */}
            <div>
              {/* Category tags */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-mono font-bold uppercase tracking-[.14em] border border-blue-200/80 dark:border-blue-500/20">
                  {p.category || 'WEB APPLICATION'}
                </span>
                {d.tagline && d.tagline !== p.category && (
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono font-semibold uppercase tracking-[.14em] border border-slate-200 dark:border-slate-700">
                    {d.tagline}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-5">
                {p.title}
              </h1>

              {/* Description */}
              <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-[1.7] max-w-[480px] mb-8">
                {p.description}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mb-10">
                {p.link && p.link !== '#' && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25">
                    View Live Demo {Icons.externalLink}
                  </a>
                )}
                <button
                  onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                  Explore the Architecture {Icons.arrowDown}
                </button>
              </div>

              {/* Hero stats */}
              {heroStats.length > 0 && (
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                  {heroStats.slice(0, 3).map((s: any, i: number) => (
                    <div key={i}>
                      <div className={`text-[1.75rem] font-extrabold leading-none ${s.blue ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                        {s.value}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">{s.label}</div>
                      {s.sub && <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{s.sub}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — browser mockup */}
            <div className="lg:pt-2">
              <BrowserFrame
                label={d.screenshotUrl ? `console.${p.slug}.internal/live` : undefined}
                statusRight={p.metric ? `${p.metric} ${p.metricLabel || ''}`.trim() : undefined}
              >
                {d.screenshotUrl ? (
                  <img src={d.screenshotUrl} alt={p.title} className="w-full h-auto block" loading="lazy" />
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center opacity-40">
                      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center mx-auto mb-2">
                        {Icons.monitor}
                      </div>
                      <p className="text-slate-500 text-xs">Preview unavailable</p>
                    </div>
                  </div>
                )}
              </BrowserFrame>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          §2 PROJECT OVERVIEW
      ══════════════════════════════════════════════════════════ */}
      {d.overviewBody && (
        <section id="overview" className="bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <SectionLabel n="Section 01" text="Executive Context" />
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              Project Overview
            </h2>

            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-[1.75] max-w-3xl mb-12">
              {d.overviewBody}
            </p>

            {overviewMeta.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                {overviewMeta.map((m: any, i: number) => (
                  <div key={i} className="bg-white dark:bg-[#080D1D] p-6 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-colors">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[.14em] text-blue-600 dark:text-blue-500 mb-2.5">{m.label}</p>
                    <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-snug mb-1">{m.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{m.sub}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          §3 OPERATIONAL BOTTLENECK
      ══════════════════════════════════════════════════════════ */}
      {bottlenecks.length > 0 && (
        <section className="bg-[#f8f9fc] dark:bg-[#060b18] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <SectionLabel n="Section 02" text="Operational Friction" />
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              The Operational Bottleneck
            </h2>
            {d.bottleneckIntro && (
              <p className="text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-[1.7] mb-10">{d.bottleneckIntro}</p>
            )}

            <div className="grid md:grid-cols-3 gap-5 mt-10">
              {bottlenecks.map((bn: any, i: number) => (
                <div key={i} className="relative p-7 rounded-xl bg-white dark:bg-[#0d1526] border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-lg dark:hover:shadow-slate-950/80 transition-shadow">
                  {/* number */}
                  <div className="absolute top-5 right-5 text-[10px] font-mono text-slate-300 dark:text-slate-700 font-bold select-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* icon */}
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 flex-shrink-0">
                    {capIcons[i % capIcons.length]}
                  </div>

                  <h3 className="text-[1.05rem] font-bold text-slate-900 dark:text-white mb-3 leading-snug pr-6">
                    {bn.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-[1.65] flex-1">{bn.desc}</p>

                  {bn.impact && (
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-mono font-bold uppercase tracking-[.14em] text-slate-400 dark:text-slate-500 mb-1.5">
                        Observed Impact:
                      </p>
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
          §4 ENGINEERING STRATEGY  — dark
      ══════════════════════════════════════════════════════════ */}
      {pipeline.length > 0 && (
        <section className="bg-[#0b1120] py-20 lg:py-28 border-b border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <SectionLabel n="Section 03" text="Engineering Strategy" light />
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl leading-[1.1]">
              {d.strategyTitle || 'Our Approach: Deterministic Workflow Engineering'}
            </h2>
            {d.strategyBody && (
              <p className="text-[15px] text-slate-400 max-w-3xl leading-[1.7] mb-10">{d.strategyBody}</p>
            )}

            {/* Pipeline card */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 overflow-hidden backdrop-blur-sm">
              {/* card header */}
              <div className="px-5 py-3 border-b border-slate-700/60 bg-slate-800/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-300 font-semibold">
                  <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {d.pipelineTitle || 'Telemetry & Dispatch Ingestion Pipeline'}
                </div>
                {d.pipelineNote && (
                  <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">{d.pipelineNote}</span>
                )}
              </div>

              {/* steps */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/50">
                {pipeline.slice(0, 4).map((step: any, i: number) => (
                  <div key={i} className="p-6">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[.15em] mb-2">
                      {String(i + 1).padStart(2, '0')}. {step.label}
                    </p>
                    <h4 className="text-sm font-bold text-white mb-2 leading-snug">{step.title}</h4>
                    <p className="text-xs text-slate-400 leading-[1.6]">{step.desc}</p>
                    {step.perf && (
                      <p className="text-[10px] font-mono text-blue-400 mt-3 font-semibold">{step.perf}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* card footer */}
              {d.pipelineNoteRight && (
                <div className="px-5 py-3 border-t border-slate-700/60 bg-slate-800/40">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    {Icons.info}
                    {d.pipelineNoteRight}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          §5 KEY IMPLEMENTED CAPABILITIES
      ══════════════════════════════════════════════════════════ */}
      {capabilities.length > 0 && (
        <section className="bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <SectionLabel n="Section 04" text="Product Capabilities" />
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              Key Implemented Capabilities
            </h2>
            {d.capabilitiesIntro && (
              <p className="text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-[1.7] mb-10">{d.capabilitiesIntro}</p>
            )}

            <div className="grid md:grid-cols-2 gap-5 mt-10">
              {capabilities.map((cap: any, i: number) => {
                const tags: string[]    = Array.isArray(cap.tags)      ? cap.tags      : [];
                const kvPairs: any[]    = Array.isArray(cap.keyValues) ? cap.keyValues : [];
                return (
                  <div key={i} className="p-7 rounded-xl bg-[#f8f9fc] dark:bg-[#0d1526] border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-md dark:hover:shadow-slate-950/60 transition-shadow">
                    {/* top row */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        {capIcons[i % capIcons.length]}
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {tags.map((t: string, ti: number) => (
                            <span key={ti}
                              className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-[.12em] bg-slate-200 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="text-[1.05rem] font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                      {cap.name}
                    </h3>
                    {cap.desc && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-[1.65] flex-1">{cap.desc}</p>
                    )}

                    {kvPairs.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        {kvPairs.map((kv: any, ki: number) => (
                          <div key={ki} className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">{kv.key}</span>
                            <span className={`font-semibold font-mono text-[11px] ${kv.blue ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-200'}`}>
                              {kv.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

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
          §6 INSIDE THE PRODUCT  — full screenshot
      ══════════════════════════════════════════════════════════ */}
      {d.screenshotUrl && (
        <section className="bg-[#f8f9fc] dark:bg-[#060b18] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <SectionLabel n="Section 05" text="Visual System" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 leading-[1.15]">
              Inside the Product: Crafted for Speed &amp; High-Stress Operations
            </h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-[1.7] mb-10">
              Every screen was built to reduce cognitive friction for operators juggling dozens of incoming and outgoing tasks simultaneously.
            </p>

            <BrowserFrame
              label="Console // Main Dispatch Matrix View"
              statusRight="Display Mode: High-Density (1080p+)"
            >
              <img src={d.screenshotUrl} alt={`${p.title} dashboard`} className="w-full h-auto block" loading="lazy" />
            </BrowserFrame>

            {/* sub screenshots if any */}
            {Array.isArray(d.subScreenshots) && d.subScreenshots.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                {d.subScreenshots.slice(0, 2).map((ss: any, i: number) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{ss.label}</span>
                      {ss.badge && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {ss.badge}
                        </span>
                      )}
                    </div>
                    <img src={ss.url} alt={ss.label} className="w-full h-auto block" loading="lazy" />
                    {Array.isArray(ss.rows) && ss.rows.length > 0 && (
                      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        {ss.rows.map((row: any, ri: number) => (
                          <div key={ri} className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">{row.key}:</span>
                            <span className={`font-semibold font-mono text-[11px] ${row.blue ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          §7 HOW IT WAS BUILT  — tech specs
      ══════════════════════════════════════════════════════════ */}
      {techSpecs.length > 0 && (
        <section className="bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <SectionLabel n="Section 06" text="Technical Specifications" />
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              How It Was Built
            </h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-[1.7] mb-10">
              Clean, disciplined engineering choices designed for sustained production stability, minimal maintenance overhead, and rapid cold starts.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {techSpecs.map((tech: any, i: number) => {
                const subTags: string[] = Array.isArray(tech.tags)
                  ? tech.tags
                  : tech.tech ? [tech.tech] : [];
                return (
                  <div key={i}
                    className="p-6 rounded-xl bg-[#f8f9fc] dark:bg-[#0d1526] border border-slate-200 dark:border-slate-800 flex flex-col gap-3 hover:border-blue-300 dark:hover:border-blue-800/60 transition-colors">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-[.15em] text-slate-400 dark:text-slate-500">
                      {String(i + 1).padStart(2, '0')} // {tech.category}
                    </p>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {tech.tech || tech.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-[1.6] flex-1">{tech.desc}</p>
                    {subTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                        {subTags.map((t: string, ti: number) => (
                          <span key={ti}
                            className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-200 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300">
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
          §8 VERIFIED DELIVERABLES
      ══════════════════════════════════════════════════════════ */}
      {deliverables.length > 0 && (
        <section className="bg-[#f8f9fc] dark:bg-[#060b18] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <SectionLabel n="Section 07" text="Verifiable Deliverables" />
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              The Outcome: Verified Deliverables
            </h2>
            {d.deliverablesIntro && (
              <p className="text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-[1.7] mb-10">{d.deliverablesIntro}</p>
            )}

            <div className="grid md:grid-cols-3 gap-5 mt-10">
              {deliverables.slice(0, 3).map((del: any, i: number) => (
                <div key={i}
                  className="p-7 rounded-xl bg-white dark:bg-[#0d1526] border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-md dark:hover:shadow-slate-950/60 transition-shadow">
                  <p className="text-[9px] font-mono font-bold uppercase tracking-[.15em] text-blue-600 dark:text-blue-400 mb-4">
                    Deliverable {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-[1.05rem] font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {typeof del === 'string' ? del : del.item}
                  </h3>
                  {del.desc && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-[1.65] flex-1">{del.desc}</p>
                  )}
                  {del.value && (
                    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{del.value}</p>
                      {del.valueLabel && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{del.valueLabel}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {d.deliverablesDisclaimer && (
              <div className="mt-5 flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200/80 dark:border-blue-800/30">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">{Icons.info}</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{d.deliverablesDisclaimer}</p>
                {d.deliverablesValidated && (
                  <span className="ml-auto text-[10px] font-mono text-slate-400 dark:text-slate-500 flex-shrink-0">
                    {d.deliverablesValidated}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          §9 EXPLORE ANOTHER PROJECT
      ══════════════════════════════════════════════════════════ */}
      {relatedSlugs.length > 0 && (
        <section className="bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="flex items-end justify-between mb-10 gap-4">
              <div>
                <SectionLabel n="Section 08" text="More Case Studies" />
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Explore Another Project
                </h2>
              </div>
              <button
                onClick={() => navigateTo('/projects')}
                className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline whitespace-nowrap flex-shrink-0 flex items-center gap-1.5">
                ← Back to All Projects
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {(relatedProjects.length > 0 ? relatedProjects : relatedSlugs.slice(0, 2).map(s => ({ slug: s }))).map((rp: any, i: number) => (
                <button key={i}
                  onClick={() => navigateTo(`/projects/${rp.slug}`)}
                  className="group p-7 rounded-xl bg-white dark:bg-[#0d1526] border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-lg dark:hover:shadow-slate-950/60 transition-all text-left">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex flex-wrap gap-1.5">
                      {rp.category && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-[.12em] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          {rp.category}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                        // {rp.year || new Date().getFullYear()}
                      </span>
                    </div>
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all flex-shrink-0">
                      {Icons.arrowRight}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {rp.title || rp.slug?.replace(/-/g, ' ')}
                  </h3>

                  {rp.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-[1.6] line-clamp-2 mb-5">{rp.description}</p>
                  )}

                  {Array.isArray(rp.tech) && rp.tech.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {rp.tech.slice(0, 4).map((t: string, ti: number) => (
                        <span key={ti} className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {ti > 0 && <span className="mr-3 text-slate-300 dark:text-slate-700">•</span>}
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {!rp.title && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-3 font-semibold">View Case Study →</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          §10 FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#070d1e] py-28 lg:py-36 overflow-hidden">
        {/* subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.8) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />

        <div className="relative max-w-[680px] mx-auto px-6 text-center">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-blue-400/80 mb-7">
            ALZERA DIGITAL CONSULTANCY
          </p>
          <h2 className="text-5xl lg:text-[3.75rem] font-extrabold text-white mb-6 leading-[1.06] tracking-tight">
            Building Something Similar?
          </h2>
          <p className="text-[15px] text-slate-400 mb-10 leading-[1.75] max-w-[520px] mx-auto">
            Tell us about your operations, bottlenecks, and the digital tools you need. Let's explore the right architecture for your business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <button
              onClick={() => navigateTo('/contact')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg transition-colors text-sm shadow-xl shadow-blue-600/20">
              Discuss Your Project
            </button>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors text-sm text-center">
              Explore Our Services
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Fast 24-hour response confirmation. Direct developer contact.
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProjectDetailPage;
