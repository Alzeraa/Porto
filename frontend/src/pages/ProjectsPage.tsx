import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { smoothScrollTo } from '../utils/scroll';
import { navigateTo } from '../utils/navigation';
import { projectSummaries, type ProjectSummary } from '../data/projects';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project extends ProjectSummary {
  id?: number;
  link?: string;
}

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────

const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
});

// ─── Default projects ─────────────────────────────────────────────────────────

const defaultProjects: Project[] = projectSummaries;

// ─── ProjectCard (standard grid card) ────────────────────────────────────────

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const { ref, visible } = useInView(0.08);
  return (
    <article
      ref={ref}
      className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden hover:shadow-lg dark:hover:shadow-blue-900/10 transition-shadow duration-300 cursor-pointer"
      style={reveal(visible, index * 0.07)}
      onClick={() => navigateTo(`/projects/${project.slug}`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-800">
        {/* Category + Static badge */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
          <span className="px-2 py-1 rounded text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-sm">
            {project.category}
          </span>
          {project.badge && (
            <span className="px-2 py-1 rounded text-[10px] font-semibold bg-blue-600/80 text-white backdrop-blur-sm">
              {project.badge}
            </span>
          )}
        </div>

        {/* Metric overlay at bottom */}
        {project.metric && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div className="flex items-end justify-between">
              <div>
                {project.industry && (
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">{project.industry.split('//')[0].trim()}</p>
                )}
                <p className="text-sm font-bold text-white leading-tight">{project.metric} {project.metricLabel?.includes('Monthly') || project.metricLabel?.includes('Branches') ? project.metricLabel : ''}</p>
              </div>
            </div>
          </div>
        )}

        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-1">
          {project.industry && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-500 dark:text-blue-400">
              {project.industry}
            </span>
          )}
          {project.year && (
            <span className="text-[10px] text-slate-400">{project.year}</span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug mt-1">
          {project.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t, i) => (
            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigateTo(`/projects/${project.slug}`)}
          >
            View Case Study
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          {project.deployNote && (
            <span className="text-[10px] text-slate-400 italic">{project.deployNote}</span>
          )}
        </div>
      </div>
    </article>
  );
};

// ─── FeaturedCard (LogiFlow — large horizontal) ───────────────────────────────

const FeaturedCard = ({ project }: { project: Project }) => {
  const { ref, visible } = useInView(0.08);
  return (
    <div
      ref={ref}
      className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/60"
      style={reveal(visible)}
    >
      <div className="grid lg:grid-cols-12 gap-0">
        {/* Left — mockup terminal */}
        <div className="lg:col-span-5 bg-[#0D1526] p-6 flex flex-col gap-4">
          {/* Terminal header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">LogiFlow Command Center</p>
                <p className="text-[10px] text-slate-500">Node: jk-fleet-04 // Live Ingestion</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              99.98% Telemetry Up
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Active Units', value: '124 / 130' },
              { label: 'Waybills Dispatched', value: '1,489' },
              { label: 'Avg Transit SLA', value: '-18.4%', red: true },
            ].map((s, i) => (
              <div key={i} className="bg-[#111827] rounded-lg p-3">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
                <p className={`text-sm font-bold ${s.red ? 'text-red-400' : 'text-white'}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Mini table */}
          <div className="bg-[#111827] rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 px-3 py-2 border-b border-slate-800">
              {['Route ID', 'Assigned Driver', 'Status', 'ETA'].map((h) => (
                <span key={h} className="text-[9px] text-slate-500 uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {[
              { route: '#TR-8862', driver: 'A. Pratama (Volvo FMX)', status: 'En Route', eta: '14:15 WIB', green: true },
              { route: '#TR-8995', driver: 'B. Wickstrom (Hino 500)', status: 'Docking', eta: '14:30 WIB', blue: true },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 px-3 py-2.5 border-b border-slate-800/50 last:border-0">
                <span className="text-[10px] text-slate-300 font-mono">{row.route}</span>
                <span className="text-[10px] text-slate-400 truncate pr-2">{row.driver}</span>
                <span className={`text-[10px] font-semibold ${row.green ? 'text-green-400' : 'text-blue-400'}`}>{row.status}</span>
                <span className="text-[10px] text-slate-400">{row.eta}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[10px] text-slate-500">{project.badge}</span>
            <span className="text-[10px] text-slate-600 italic">{project.deployNote}</span>
          </div>
        </div>

        {/* Right — case study content */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blue-500">
                {project.industry}
              </span>
              <span className="text-xs text-slate-400">{project.year}</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{project.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{project.description}</p>

            <div className="mb-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">
                Key Deliverables &amp; Architectural Components:
              </p>
              <ul className="space-y-2">
                {[
                  'Real-Time GPS Tracking Pipeline',
                  'Multi-Tier Driver Dispatch Queue',
                  'Automated Waybill Generation',
                  'Role-Based Dispatcher Access',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((t, i) => (
                <span key={i} className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t}{i < 3 ? ' •' : ''}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigateTo(`/projects/${project.slug}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-colors"
            >
              View Full Case Study
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTERS = ['All Projects', 'Website Development', 'Web Applications', 'Business Systems', 'Other'];

// ─── ProjectsPage ─────────────────────────────────────────────────────────────

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [filter, setFilter] = useState('All Projects');
  const [search, setSearch] = useState('');
  const [whatsapp, setWhatsapp] = useState('628818411915');

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fetch(API_ENDPOINTS.projects)
      .then((r) => r.json())
      .then((res) => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data);
        }
      })
      .catch(() => {});

    fetch(API_ENDPOINTS.profile)
      .then((r) => r.json())
      .then((res) => { if (res.data?.whatsapp) setWhatsapp(res.data.whatsapp.replace(/\D/g, '')); })
      .catch(() => {});
  }, []);

  const heroSec = useInView(0.1);
  const indexSec = useInView(0.1);
  const ctaSec = useInView(0.15);

  // Filter + search
  const filtered = projects.filter((p) => {
    const matchFilter = filter === 'All Projects' || p.category === filter;
    const matchSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const featured = defaultProjects[0];
  const gridProjects = filtered.filter((_, i) => i > 0 || filter !== 'All Projects' || search !== '');
  const showFeatured = filter === 'All Projects' && search === '';

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────
          HERO
      ───────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#080D1D] pt-28 pb-16 lg:pt-32 lg:pb-20 border-b border-[#1E293B]/60 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">

            {/* Left */}
            <div
              ref={heroSec.ref}
              className="lg:col-span-6"
              style={reveal(heroSec.visible)}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-5">
                <span className="font-mono text-[10px] text-blue-500 tracking-widest uppercase">✦ Our Work</span>
                <span className="text-slate-700 text-[10px]">/</span>
                <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">ALZERA Digital Studio</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-bold tracking-tight text-white leading-[1.06] mb-5">
                Selected Projects.<br />Practical Solutions.
              </h1>
              <p className="text-[15px] text-[#8E9DB5] leading-relaxed max-w-lg mb-7">
                Explore websites, web applications, and digital systems engineered to solve real operational bottlenecks, accelerate scale, and support concrete business outcomes.
              </p>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {['Websites', 'Web Applications', 'Digital Systems', 'Architecture & Cloud'].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — decorative A prism */}
            <div className="lg:col-span-6 flex justify-end items-center" style={reveal(heroSec.visible, 0.15)}>
              <div className="relative w-64 h-48 flex items-center justify-center">
                <svg viewBox="0 0 300 220" fill="none" className="w-full h-full opacity-30">
                  <defs>
                    <linearGradient id="prA" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                  <polygon points="70,220 130,40 165,40 280,220 220,220 150,80 110,220" fill="url(#prA)" opacity="0.7" />
                  <polygon points="130,40 185,0 260,140 220,140 165,40" fill="#2563EB" />
                </svg>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                  <p className="font-mono text-[10px] text-slate-500 tracking-widest">ALZERA LABS</p>
                  <p className="font-mono text-[10px] text-blue-500 tracking-widest">v4.2 PROD</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          PROJECT INDEX
      ───────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#080D1D] py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          {/* Index header */}
          <div
            ref={indexSec.ref}
            style={reveal(indexSec.visible)}
            className="mb-10"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
              Project Index
            </span>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  A Closer Look at Our Work
                </h2>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  Every implementation starts with an engineering challenge. Explore the engineering choices, user flows, and metrics behind each system.
                </p>
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold whitespace-nowrap self-start sm:self-auto border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full">
                Showing {filtered.length} Selected Case Studies
              </span>
            </div>
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 flex-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by keyword, client type, or s..."
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full sm:w-72"
              />
            </div>
          </div>

          {/* Featured card */}
          {showFeatured && (
            <div className="mb-8">
              <FeaturedCard project={featured} />
            </div>
          )}

          {/* Grid cards */}
          {(showFeatured ? filtered.slice(1) : filtered).length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {(showFeatured ? filtered.slice(1) : filtered).map((project, i) => (
                <ProjectCard key={project.id ?? i} project={project} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400 text-sm">No projects match your filter. Try a different category or keyword.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          CTA
      ───────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#080D1D] py-10 lg:py-14">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div
            ref={ctaSec.ref}
            className="rounded-2xl border border-[#1E3A5F]/60 bg-gradient-to-br from-[#0D1F3C] to-[#0B1526] px-8 py-10 lg:px-12 grid lg:grid-cols-12 gap-8 items-center"
            style={reveal(ctaSec.visible)}
          >
            {/* Left */}
            <div className="lg:col-span-7">
              {/* Label pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-800/50 bg-blue-900/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                  Start Your Engineering Journey
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
                Have a Project in Mind?
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-5">
                Tell us what you want to build. We'll help you explore the right architecture, technical roadmap, realistic timeline, and practical next step.
              </p>

              {/* Trust line */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Fast 24-hour response guarantee • Confidential NDA upon request
              </div>
            </div>

            {/* Right — buttons stacked */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <button
                onClick={() => navigateTo('/contact')}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide transition-colors shadow-lg shadow-blue-600/30"
              >
                Discuss Your Project
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-sm transition-all"
              >
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Direct Inquiry via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;
