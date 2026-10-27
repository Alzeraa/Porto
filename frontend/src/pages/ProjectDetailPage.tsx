import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { smoothScrollTo } from '../utils/scroll';
import { navigateTo } from '../utils/navigation';
import { getProjectBySlug, getRelatedProjects, type ProjectDetail as ProjectData } from '../data/projects';

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

const rv = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(18px)',
  transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
});

// ─── SectionLabel ─────────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
    {children}
  </span>
);

// ─── CapabilityCard ───────────────────────────────────────────────────────────

const CapabilityCard = ({
  icon, tag, title, desc, meta1, meta2, meta1Label, meta2Label, index,
}: {
  icon: React.ReactNode; tag: string; title: string; desc: string;
  meta1: string; meta2: string; meta1Label: string; meta2Label: string; index: number;
}) => {
  const { ref, visible } = useInView(0.08);
  return (
    <div
      ref={ref}
      className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6"
      style={rv(visible, index * 0.08)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <span className="font-mono text-[10px] font-semibold text-blue-500 tracking-wider">{tag}</span>
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-5">{desc}</p>
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="text-slate-500">{meta1Label}: <span className="text-slate-700 dark:text-slate-300 font-medium">{meta1}</span></span>
        <span className="text-blue-600 dark:text-blue-400 font-semibold">{meta2Label}: {meta2}</span>
      </div>
    </div>
  );
};

// ─── TechCard ─────────────────────────────────────────────────────────────────

const TechCard = ({ num, layer, title, desc, pills, index }: {
  num: string; layer: string; title: string; desc: string; pills: string[]; index: number;
}) => {
  const { ref, visible } = useInView(0.08);
  return (
    <div ref={ref} className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6" style={rv(visible, index * 0.08)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="font-mono text-[10px] text-slate-400">{num}</span>
        <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wider">// {layer}</span>
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4">{desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {pills.map((p) => (
          <span key={p} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{p}</span>
        ))}
      </div>
    </div>
  );
};

// ─── DeliverableCard ──────────────────────────────────────────────────────────

const DeliverableCard = ({ num, title, desc, metric, metricLabel, index }: {
  num: string; title: string; desc: string; metric: string; metricLabel: string; index: number;
}) => {
  const { ref, visible } = useInView(0.08);
  return (
    <div ref={ref} className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6" style={rv(visible, index * 0.08)}>
      <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wider mb-3">DELIVERABLE {num}</span>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-5">{desc}</p>
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metric}</div>
        <div className="text-xs text-slate-500 mt-0.5">{metricLabel}</div>
      </div>
    </div>
  );
};

// ─── RelatedCard ──────────────────────────────────────────────────────────────

const RelatedCard = ({ tag, year, title, desc, tech, index }: {
  tag: string; year: string; title: string; desc: string; tech: string[]; index: number;
}) => {
  const { ref, visible } = useInView(0.08);
  return (
    <div
      ref={ref}
      className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-7 hover:border-blue-400/40 dark:hover:border-blue-600/40 hover:shadow-md transition-all duration-300 cursor-pointer"
      style={rv(visible, index * 0.1)}
      onClick={() => navigateTo('/projects')}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
            {tag} // {year}
          </span>
        </div>
        <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4">{desc}</p>
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        {tech.map((t, i) => (
          <span key={i} className="text-xs text-slate-500 dark:text-slate-400">
            {t}{i < tech.length - 1 ? ' •' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── BottleneckCard ───────────────────────────────────────────────────────────

const BottleneckCard = ({ num, icon, title, desc, impact, impactLabel, index }: {
  num: string; icon: React.ReactNode; title: string; desc: string; impact: string; impactLabel: string; index: number;
}) => {
  const { ref, visible } = useInView(0.08);
  return (
    <div ref={ref} className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6" style={rv(visible, index * 0.08)}>
      <div className="mb-4 text-blue-600 dark:text-blue-400">{icon}</div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        <span className="text-slate-400 font-mono text-xs mr-2">{num}</span>{title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mt-2 mb-5">{desc}</p>
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Observed Impact:</p>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{impact}</p>
      </div>
    </div>
  );
};

// ─── ProjectDetailPage ────────────────────────────────────────────────────────

const ProjectDetailPage = ({ projectId }: { projectId?: string }) => {
  const [whatsapp, setWhatsapp] = useState('628818411915');

  // Look up project data by slug (projectId is the URL slug)
  const project: ProjectData | undefined = projectId ? getProjectBySlug(projectId) : getProjectBySlug('logiflow-dispatch-fleet-portal');
  const relatedProjects = project ? getRelatedProjects(project.relatedSlugs) : [];

  // Fallback if slug not found — use first project
  const p = project ?? getProjectBySlug('logiflow-dispatch-fleet-portal')!;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fetch(API_ENDPOINTS.profile)
      .then((r) => r.json())
      .then((res) => { if (res.data?.whatsapp) setWhatsapp(res.data.whatsapp.replace(/\D/g, '')); })
      .catch(() => {});
  }, [projectId]);

  // Section refs
  const heroSec  = useInView(0.1);
  const sec01    = useInView(0.1);
  const sec02    = useInView(0.1);
  const sec03    = useInView(0.1);
  const sec04    = useInView(0.1);
  const sec05    = useInView(0.1);
  const sec06    = useInView(0.1);
  const sec07    = useInView(0.1);
  const sec08    = useInView(0.1);
  const ctaSec   = useInView(0.15);

  return (
    <>
      {/* ── BREADCRUMB ──────────────────────────────────────────────────── */}
      <div className="w-full bg-white dark:bg-[#080D1D] pt-20 border-b border-slate-200 dark:border-[#1E293B]/40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={() => navigateTo('/')} className="hover:text-slate-800 dark:hover:text-white transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => navigateTo('/projects')} className="hover:text-slate-800 dark:hover:text-white transition-colors">Projects</button>
            <span>/</span>
            <span className="text-slate-800 dark:text-white font-medium">LogiFlow Dispatch &amp; Fleet Portal</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Case Study // 2024
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-500 font-mono">ALZERA Project Archive #CS-04</span>
          </div>
        </div>
      </div>

      {/* ── SECTION HERO ────────────────────────────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#080D1D] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-start">

            {/* Left */}
            <div ref={heroSec.ref} className="lg:col-span-5" style={rv(heroSec.visible)}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                  WEB APPLICATION // LOGISTICS TELEMETRY
                </span>
                <span className="text-[10px] text-slate-400 italic">[Sample Case Study Demonstration]</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.06] mb-4">
                LogiFlow Dispatch &amp; Fleet Portal
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-7 max-w-md">
                A custom real-time telemetry dashboard and driver dispatch queue engineered for high-volume regional transport logistics operators handling 120+ active cross-island units.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-600/25"
                >
                  View Live Demo
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={() => smoothScrollTo('#architecture')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Explore the Architecture
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                {[
                  { label: 'Active Fleet', value: '124 / 130', sub: '95.4% In-Field' },
                  { label: 'Sync Latency', value: '< 120ms', sub: 'Sub-second Pings', blue: true },
                  { label: 'SLA Impact', value: '-18.4%', sub: 'Transit Variance', blue: true },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className={`text-lg font-bold ${s.blue ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{s.value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — terminal mockup */}
            <div className="lg:col-span-7" style={rv(heroSec.visible, 0.15)}>
              <div className="rounded-xl border border-[#1E293B] bg-[#0D1526] overflow-hidden shadow-2xl">
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E293B]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">console.logiflow.internal/telemetry/live</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    99.98% TELEMETRY UP
                  </span>
                </div>

                {/* Corridor header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E293B]/60 bg-[#111827]/40">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-blue-600/30 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-white">East Java &amp; Bali Transit Corridor</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span>NODE: <span className="text-white">S8Y-SUB01</span></span>
                    <span>WAYBILLS: <span className="text-white">1,489</span></span>
                  </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-4 px-4 py-2 bg-[#111827]/60">
                  {['UNIT ID', 'DRIVER', 'STATUS', 'ETA'].map((h) => (
                    <span key={h} className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{h}</span>
                  ))}
                </div>

                {/* Table rows */}
                {[
                  { id: '#TR-8092', driver: 'Bambang H.', status: 'En Route', statusColor: 'text-green-400', eta: '14:15 WIB' },
                  { id: '#TR-8095', driver: 'Siti Rahma', status: 'Docking (Hub B)', statusColor: 'text-blue-400', eta: '13:50 WIB' },
                  { id: '#TR-8104', driver: 'Dimas Prasetyo', status: 'En Route (Ferry)', statusColor: 'text-green-400', eta: '16:40 WIB' },
                ].map((row, i) => (
                  <div key={i} className={`grid grid-cols-4 px-4 py-3 border-b border-[#1E293B]/40 last:border-0 ${i % 2 === 0 ? 'bg-transparent' : 'bg-[#111827]/20'}`}>
                    <span className="text-[11px] text-slate-300 font-mono">{row.id}</span>
                    <span className="text-[11px] text-slate-400">{row.driver}</span>
                    <span className={`text-[11px] font-semibold ${row.statusColor}`}>{row.status}</span>
                    <span className="text-[11px] text-slate-400">{row.eta}</span>
                  </div>
                ))}

                {/* Geo clusters */}
                <div className="px-4 py-3 bg-[#111827]/40 border-t border-[#1E293B]/60">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      Active Geo-Clusters (Surabaya · Banyuwangi · Denpasar)
                    </div>
                    <span>GPS TICK: 4.8s avg</span>
                  </div>
                  {/* Latency chart placeholder */}
                  <div className="mt-3 h-16 relative flex items-end gap-0.5">
                    {[30, 45, 35, 50, 40, 55, 35, 42, 38, 48, 42, 52, 38, 45, 35, 50, 42, 38, 45, 40].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-blue-600/30"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                    {/* Dot + tooltip */}
                    <div className="absolute right-4 top-1/4 flex flex-col items-end">
                      <div className="w-2 h-2 rounded-full bg-blue-400 shadow-md shadow-blue-400/50"></div>
                    </div>
                  </div>
                  <div className="mt-2 text-[9px] text-slate-600 font-mono">
                    Corridor Latency: 42ms // In-Cab Cellular Signal: 94%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 01 // EXECUTIVE CONTEXT ─────────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#080D1D] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div ref={sec01.ref} style={rv(sec01.visible)} className="mb-10">
            <SectionLabel>Section 01 // Executive Context</SectionLabel>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Project Overview</h2>
          </div>
          <div style={rv(sec01.visible, 0.1)}>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-10">
              Logistics coordination across fragmented transport routes previously relied on manual WhatsApp groups, delayed spreadsheet waybills, and unverified driver check-ins. ALZERA architected and built LogiFlow—a unified, role-based telemetry portal that centralizes real-time vehicle positioning, automated waybill generation, and queue-based dispatcher assignments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {[
                { label: 'Client / Domain', title: 'Regional Fleet Logistics', sub: 'Cross-island transport operator (Indonesia)' },
                { label: 'Deliverable Type', title: 'Custom Web Application', sub: 'Realtime Telemetry & Admin Console' },
                { label: 'Project Timeline', title: '8 Weeks Delivery', sub: 'Milestone-based delivery (Q2 2024)' },
                { label: 'Core Role', title: 'Full-Cycle Architecture', sub: 'UI/UX Systems, Frontend & Backend' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-[#080D1D] p-6">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 02 // OPERATIONAL FRICTION ──────────────────────────── */}
      <section className="w-full bg-slate-50 dark:bg-[#080D1D] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div ref={sec02.ref} style={rv(sec02.visible)} className="mb-10">
            <SectionLabel>Section 02 // Operational Friction</SectionLabel>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">The Operational Bottleneck</h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Prior to the deployment of LogiFlow, fleet dispatchers struggled with three high-cost systemic bottlenecks that directly eroded margin and created daily scheduling volatility.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <BottleneckCard
              index={0} num="01"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              title="Unsynchronized Dispatch Queues"
              desc="Waybills created manually in spreadsheets caused duplicate vehicle bookings and average dispatch delays of 45+ minutes per driver staging cycle."
              impact="45+ min/cycle idle loss" impactLabel=""
            />
            <BottleneckCard
              index={1} num="02"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>}
              title="Blind Transit Periods"
              desc="Regional transit routes suffered from zero real-time visibility, leading to unverified driver deviations, inaccurate customer ETAs, and lost cargo claims."
              impact="Zero location verifiability" impactLabel=""
            />
            <BottleneckCard
              index={2} num="03"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title="Disjointed Waybill Invoicing"
              desc="Physical paper-based waybills delayed billing cycles by up to 14 business days while awaiting signed arrival manifests from remote destination ports."
              impact="14-day receivable lag" impactLabel=""
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 03 // ENGINEERING STRATEGY ──────────────────────────── */}
      <section id="architecture" className="w-full bg-slate-950 dark:bg-[#04060F] py-16 lg:py-20 border-b border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div ref={sec03.ref} style={rv(sec03.visible)} className="mb-10">
            <SectionLabel>Section 03 // Engineering Strategy</SectionLabel>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-white">Our Approach: Deterministic Workflow Engineering</h2>
            <p className="mt-3 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Rather than relying on generic off-the-shelf SaaS with prohibitive recurring per-seat licensing, ALZERA engineered an event-driven telemetry pipeline combining lightweight WebSockets with Redis in-memory pub/sub to stream driver GPS pings without overloading the relational database.
            </p>
          </div>

          {/* Pipeline diagram */}
          <div style={rv(sec03.visible, 0.1)}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white">Telemetry &amp; Dispatch Ingestion Pipeline</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 border border-slate-800 px-3 py-1 rounded">Average Pipeline Latency: ~84ms</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { num: '01.', label: 'INGESTION', title: 'Driver Mobile PWA / GPS', desc: 'In-cab GPS client transmits coordinate arrays, vehicle speed, and battery health every 5,000ms.', perf: 'Payload: ~348 bytes / ping' },
                { num: '02.', label: 'STREAMING', title: 'ALZERA Telemetry Gateway', desc: 'Node.js + WebSockets server layer validating authentication tokens and route bounds instantly.', perf: 'Throughput: 1,200 msg/sec' },
                { num: '03.', label: 'CACHING', title: 'Redis In-Memory Pub/Sub', desc: 'Broadcasts delta updates to subscribed operator browser rooms without database read locks.', perf: 'Sub/Pub Fanout: 4ms' },
                { num: '04.', label: 'RENDERING', title: 'Dispatcher Command Center', desc: 'React + Leaflet web dashboard rendering vehicle markers with GPU-accelerated canvas layer.', perf: 'Frame Rate: 60 FPS constant' },
              ].map((step, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[10px] text-slate-500">{step.num}</span>
                    <span className="font-mono text-[10px] text-blue-500 font-semibold tracking-wider">{step.label}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{step.desc}</p>
                  <p className="text-[10px] text-blue-400 font-mono">{step.perf}</p>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-slate-400">Historical telemetry logs are batched into PostgreSQL (PostGIS) in 60-second intervals to minimize DB writes.</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap ml-4">DB Write Reduction: ~88%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 04 // PRODUCT CAPABILITIES ──────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#080D1D] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div ref={sec04.ref} style={rv(sec04.visible)} className="mb-10">
            <SectionLabel>Section 04 // Product Capabilities</SectionLabel>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Key Implemented Capabilities</h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Engineered to perform in high-stress operational environments with strict role partitioning and fault-tolerant fallbacks.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <CapabilityCard index={0}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              tag="TELEMETRY // LIVE"
              title="Real-Time GPS Tracking Pipeline"
              desc="5-second interval heartbeat ingestion with geofence breach notifications and automated transit status toggling when passing toll points or regional checkpoints."
              meta1="5000ms" meta1Label="Interval"
              meta2="100m Radius Buffer" meta2Label="Geofence"
            />
            <CapabilityCard index={1}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
              tag="DISPATCH // QUEUE"
              title="Multi-Tier Driver Dispatch Queue"
              desc="Intelligent route sorting matching pending waybills with closest certified available driver profiles and vehicle weight capacities to prevent over-allocation."
              meta1="Automated" meta1Label="Capacity Match"
              meta2="Active" meta2Label="Driver Rest Guard"
            />
            <CapabilityCard index={2}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              tag="DOCUMENTATION // POD"
              title="Automated Waybill & Digital POD"
              desc="Instant PDF waybill compilation with digital proof-of-delivery signatures, customer photo capture, and automated WhatsApp manifest dispatching directly to consignees."
              meta1="Vector SVG" meta1Label="Signature Capture"
              meta2="Yes" meta2Label="Direct WhatsApp Push"
            />
            <CapabilityCard index={3}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              tag="SECURITY // RBAC"
              title="Role-Based Access (RBAC Level 4)"
              desc="Strict permission partitioning separating Senior Fleet Controllers, Branch Dispatchers, and Financial Audit teams with cryptographically signed audit trail logging."
              meta1="4 Levels" meta1Label="Granular Tiers"
              meta2="Immutable" meta2Label="Audit Logging"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 05 // VISUAL SYSTEM ──────────────────────────────────── */}
      <section className="w-full bg-slate-50 dark:bg-[#080D1D] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div ref={sec05.ref} style={rv(sec05.visible)} className="mb-10">
            <SectionLabel>Section 05 // Visual System</SectionLabel>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Inside the Product: Crafted for Speed &amp; High-Stress Operations
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Every screen was built to reduce cognitive friction for dispatchers juggling dozens of incoming and outgoing transport legs simultaneously.
            </p>
          </div>

          {/* Main console mockup */}
          <div className="rounded-xl border border-[#1E293B] bg-[#0D1526] overflow-hidden shadow-2xl mb-6" style={rv(sec05.visible, 0.1)}>
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="font-mono text-[10px] text-slate-500 ml-2">Console // Main Dispatch Matrix View</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">Display Mode: High-Density (1080p+)</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-0 divide-x divide-[#1E293B]">
              {/* Left — dispatch queue */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-white">Dispatch Queue (8 Pending)</span>
                  <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-blue-600/20 text-blue-400 border border-blue-600/20">Sort: Urgent SLA</span>
                </div>
                {[
                  { id: 'WB-2024-8841', route: 'Surabaya Hub → Pelabuhan Ketapang', cargo: 'Cold Storage (12.4t)', assigned: 'Assigned: Unit #8092', status: 'Overdue (15m)', statusRed: true },
                  { id: 'WB-2024-8842', route: 'Gresik Industrial → Denpasar Central', cargo: 'Dry Freight (18.0t)', assigned: 'Pending Driver Assign', status: 'Staging Hub', statusBlue: true },
                  { id: 'WB-2024-8845', route: 'Malang Depot → Singaraja Hub', cargo: 'Agrotech Fresh (8.2t)', assigned: 'Assigned: Unit #8104', status: 'In Loading', statusGray: true },
                ].map((row, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-bold text-white">{row.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${row.statusRed ? 'bg-red-900/40 text-red-400' : row.statusBlue ? 'bg-blue-900/40 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                        {row.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{row.route}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-slate-500">Cargo: {row.cargo}</span>
                      <span className="text-[10px] text-slate-500">{row.assigned}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right — map panel */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm font-bold text-white">Live Corridor Telemetry</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">LAT: -7.2575  LNG: 112.7521</span>
                </div>
                {/* Map placeholder */}
                <div className="relative h-44 rounded-lg bg-[#111827] border border-slate-800 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="absolute border-t border-slate-600" style={{ top: `${i * 14}%`, left: 0, right: 0 }} />
                    ))}
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="absolute border-l border-slate-600" style={{ left: `${i * 14}%`, top: 0, bottom: 0 }} />
                    ))}
                  </div>
                  {/* Animated truck dot */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1E293B] border border-slate-700 rounded px-2.5 py-1.5 whitespace-nowrap">
                        <p className="text-[10px] font-bold text-white">Unit #TR-8092</p>
                        <p className="text-[9px] text-slate-400">Speed: 64 km/h // Tol Probolinggo</p>
                      </div>
                    </div>
                    {/* Route line */}
                    <div className="mt-2 w-32 h-px bg-gradient-to-r from-transparent via-blue-500 to-blue-300"></div>
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-300/50 border border-blue-400"></div>
                  </div>
                </div>
                {/* Status bar */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Active Geofence Alerts: None</span>
                  <span>GPS Engine: Healthy (42 Satellites In View)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-views */}
          <div className="grid md:grid-cols-2 gap-5" style={rv(sec05.visible, 0.2)}>
            {[
              {
                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
                title: 'Driver Route & Manifest View', tag: 'PWA Client',
                desc: 'Driver-facing mobile view displaying pre-trip inspection checklists, weight certificates, and dynamic QR arrival verifications.',
                rows: [
                  { label: 'Waybill Barcode:', value: '|||| | ||| || ||| (8841-XYZ)', blue: true },
                  { label: 'Vehicle Tare Weight:', value: '7,200 kg' },
                  { label: 'Gross Certified Load:', value: '19,600 kg (Safe Margin +4.2%)', blue: true },
                  { label: 'Proof of Delivery:', value: 'Consignee Sign + Photo Required', bold: true },
                ],
              },
              {
                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                title: 'Fleet Analytics & Transit SLA Console', tag: 'Auditor View',
                desc: 'Management dashboard visualizing turnaround times, fuel efficiency deviations, and automated on-time dispatch SLA adherence.',
                rows: [
                  { label: 'Monthly Dispatch Adherence:', value: '94.8% (Target: 92.0%)', blue: true },
                  { label: 'Fuel Variance Delta:', value: '-6.2% vs Route Baseline', red: true },
                  { label: 'Driver Turnaround (Avg):', value: '32 minutes (down from 77m)' },
                  { label: 'Audit Compliance Score:', value: '99.4% Verified Signatures', bold: true },
                ],
              },
            ].map((view, vi) => (
              <div key={vi} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-white">
                    {view.icon}
                    <span className="text-sm font-bold">{view.title}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">{view.tag}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{view.desc}</p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {view.rows.map((row, ri) => (
                    <div key={ri} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{row.label}</span>
                      <span className={`text-xs font-medium ${(row as any).blue ? 'text-blue-600 dark:text-blue-400' : (row as any).red ? 'text-red-500' : (row as any).bold ? 'text-slate-800 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 06 // TECHNICAL SPECIFICATIONS ───────────────────────── */}
      <section className="w-full bg-white dark:bg-[#080D1D] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div ref={sec06.ref} style={rv(sec06.visible)} className="mb-10">
            <SectionLabel>Section 06 // Technical Specifications</SectionLabel>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">How It Was Built</h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Clean, disciplined engineering choices designed for sustained production stability, minimal maintenance overhead, and rapid cold starts.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <TechCard index={0} num="01" layer="FRONTEND LAYER"
              title="React 18 & Leaflet.js"
              desc="Custom map vector layers with TanStack Query caching state so operators can toggle between hundreds of live vehicles without browser UI jank."
              pills={['React 18', 'Tailwind CSS', 'Leaflet']}
            />
            <TechCard index={1} num="02" layer="REALTIME TELEMETRY"
              title="WebSockets & Redis"
              desc="Lightweight Node.js WebSocket gateway connected to Redis pub/sub channels ensuring sub-100ms GPS fanout across all active dispatch terminals."
              pills={['Node.js', 'WebSockets', 'Redis Pub/Sub']}
            />
            <TechCard index={2} num="03" layer="SPATIAL DATA STORE"
              title="PostgreSQL & PostGIS"
              desc="Industrial spatial database with PostGIS geometry indexing, enabling sub-millisecond geofencing queries and historical breadcrumb route tracking."
              pills={['PostgreSQL', 'PostGIS', 'Spatial Indexes']}
            />
            <TechCard index={3} num="04" layer="SECURITY & INFRA"
              title="Docker & Argon2 RBAC"
              desc="Containerized deployment with strict Argon2 password hashing, secure HTTP-only cookie sessions, and encrypted automated off-site backups."
              pills={['Docker', 'Argon2', 'Cloud VPS']}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 07 // VERIFIABLE DELIVERABLES ───────────────────────── */}
      <section className="w-full bg-slate-50 dark:bg-[#080D1D] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div ref={sec07.ref} style={rv(sec07.visible)} className="mb-10">
            <SectionLabel>Section 07 // Verifiable Deliverables</SectionLabel>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">The Outcome: Verified Deliverables</h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              ALZERA prioritizes genuine engineering outcomes over exaggerated vanity metrics. Every metric reported represents verified load performance and workflow adoption.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <DeliverableCard index={0} num="01"
              title="Zero-Lag Telemetry Processing"
              desc="Sustained sub-120ms ping-to-screen updates across 130 active units under continuous live test loads with zero memory leaks."
              metric="< 120ms" metricLabel="Ping-to-Screen Update Latency"
            />
            <DeliverableCard index={1} num="02"
              title="Elimination of Manual Spreadsheets"
              desc="100% of driver assignments, weight tickets, and waybill manifests successfully migrated to the unified automated dispatch queue."
              metric="100%" metricLabel="Digital Queue Migration"
            />
            <DeliverableCard index={2} num="03"
              title="Integrated Offline Resilience"
              desc="Driver mobile web application caches waybill updates and customer proof-of-delivery locally, synchronizing automatically upon cellular reconnection."
              metric="0 Lost PODs" metricLabel="Across Maritime Route Gaps"
            />
          </div>
          {/* Disclaimer */}
          <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 px-5 py-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-slate-500">[Sample Case Study Demonstration]: Telemetry load metrics tested in staged production environment with simulated GPS node payloads.</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap ml-4">Validated Q2 2024</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 08 // MORE CASE STUDIES ─────────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#080D1D] py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div ref={sec08.ref} style={rv(sec08.visible)} className="flex items-center justify-between mb-8">
            <div>
              <SectionLabel>Section 08 // More Case Studies</SectionLabel>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Explore Another Project</h2>
            </div>
            <button
              onClick={() => navigateTo('/projects')}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              ← Back to All Projects
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <RelatedCard index={0}
              tag="WEBSITE DEVELOPMENT" year="2024"
              title="Vanguard Corporate & Investor Hub"
              desc="A high-performance institutional portal designed for an investment advisory firm, featuring real-time market insights and interactive portfolio disclosure sheets."
              tech={['Next.js 14', 'Tailwind', 'CMS Integration']}
            />
            <RelatedCard index={1}
              tag="BUSINESS SYSTEMS" year="2024"
              title="Medix Operational Core"
              desc="End-to-end clinical workflow automation and inventory forecasting portal handling high-volume pharmaceutical supply chains across multi-branch healthcare centers."
              tech={['FastAPI', 'PostgreSQL', 'Automated Invoicing']}
            />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#080D1D] py-20 lg:py-28">
        <div
          ref={ctaSec.ref}
          className="max-w-[680px] mx-auto px-6 lg:px-8 text-center"
          style={rv(ctaSec.visible)}
        >
          <span className="inline-block px-3 py-1.5 rounded-full border border-blue-800/50 bg-blue-900/20 font-mono text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-5">
            ALZERA Digital Consultancy
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08] mb-4">
            Building Something Similar?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto mb-8">
            Tell us about your operations, bottlenecks, and the digital tools you need. Let's explore the right architecture for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('/contact')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm tracking-wide transition-colors shadow-lg shadow-blue-600/25"
            >
              Discuss Your Project
            </button>
            <button
              onClick={() => navigateTo('/services')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-sm transition-all"
            >
              Explore Our Services
            </button>
          </div>
          <p className="mt-6 text-xs text-slate-600 flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Fast 24-hour response confirmation. Direct developer contact.
          </p>
        </div>
      </section>
    </>
  );
};

export default ProjectDetailPage;
